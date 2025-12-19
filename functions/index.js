const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const contactRateLimitMap = new Map();
const newsletterRateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;
const NEWSLETTER_RATE_LIMIT_MAX_REQUESTS = 3;

const allowedOrigins = process.env.ALLOWED_ORIGINS
	? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
	: [];

function applyCors(req, res) {
	const origin = req.headers.origin;

	if (allowedOrigins.length > 0) {
		if (origin && !allowedOrigins.includes(origin)) {
			res.status(403).json({ error: "Origin not allowed" });
			return false;
		}
		res.set("Access-Control-Allow-Origin", origin || allowedOrigins[0]);
		res.set("Vary", "Origin");
	} else {
		res.set("Access-Control-Allow-Origin", "*");
	}

	res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	return true;
}

function getRateLimitKey(req) {
	const forwarded = req.headers["x-forwarded-for"];
	if (typeof forwarded === "string" && forwarded.length > 0) {
		return forwarded.split(",")[0].trim();
	}
	return req.ip || "unknown";
}

function checkRateLimit(map, key, maxRequests) {
	const now = Date.now();
	const record = map.get(key);

	if (!record || now > record.resetTime) {
		map.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
		return true;
	}

	if (record.count >= maxRequests) {
		return false;
	}

	record.count += 1;
	return true;
}

const gmailUser = defineSecret("GMAIL_USER", { required: false });
const gmailPassword = defineSecret("GMAIL_APP_PASSWORD", { required: false });
const contactEmail = defineSecret("CONTACT_EMAIL", { required: false });

exports.contactForm = onRequest(
	{
		cors: true,
		maxInstances: 10,
		secrets: [gmailUser, gmailPassword, contactEmail]
	},
	async (req, res) => {
		if (!applyCors(req, res)) {
			return;
		}

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}

		if (req.method !== "POST") {
			return res.status(405).json({ error: "Method not allowed" });
		}

		try {
			const rateLimitKey = getRateLimitKey(req);
			if (!checkRateLimit(contactRateLimitMap, rateLimitKey, CONTACT_RATE_LIMIT_MAX_REQUESTS)) {
				res.set("Retry-After", "60");
				return res.status(429).json({ error: "Too many requests. Please try again later." });
			}

			const { name, email, interest, message, company, projectType } = req.body;

			if (!name || !email) {
				return res.status(400).json({ error: "Name and email are required" });
			}

			const emailContent = `
New contact form submission from CartShift Studio website:

Name: ${name}
Email: ${email}
${interest ? `Interest: ${interest}` : ""}
${company ? `Company: ${company}` : ""}
${projectType ? `Project Type: ${projectType}` : ""}
${message ? `Message: ${message}` : ""}
      `.trim();

			const nodemailer = require("nodemailer");

			if (gmailUser.value() && gmailPassword.value()) {
				const transporter = nodemailer.createTransport({
					service: "gmail",
					auth: {
						user: gmailUser.value(),
						pass: gmailPassword.value()
					}
				});

				const mailOptions = {
					from: gmailUser.value(),
					to: contactEmail.value() || "yotamon@gmail.com",
					subject: `New Contact Form Submission from ${name}`,
					text: emailContent
				};

				await transporter.sendMail(mailOptions);
			}

			await admin
				.firestore()
				.collection("contact_submissions")
				.add({
					name,
					email,
					interest: interest || null,
					message: message || null,
					company: company || null,
					projectType: projectType || null,
					timestamp: admin.firestore.FieldValue.serverTimestamp()
				});

			return res.status(200).json({ success: true });
		} catch (error) {
			console.error("Contact form error:", error);
			return res.status(500).json({ error: "Failed to process request" });
		}
	}
);

exports.newsletterSubscription = onRequest(
	{
		cors: true,
		maxInstances: 10,
	},
	async (req, res) => {
		if (!applyCors(req, res)) {
			return;
		}

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}

		if (req.method !== "POST") {
			return res.status(405).json({ error: "Method not allowed" });
		}

		try {
			const rateLimitKey = getRateLimitKey(req);
			if (!checkRateLimit(newsletterRateLimitMap, rateLimitKey, NEWSLETTER_RATE_LIMIT_MAX_REQUESTS)) {
				res.set("Retry-After", "60");
				return res.status(429).json({ error: "Too many requests. Please try again later." });
			}

			const { email } = req.body;

			if (!email) {
				return res.status(400).json({ error: "Email is required" });
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({ error: "Invalid email address" });
			}

			await admin
				.firestore()
				.collection("newsletter_subscriptions")
				.add({
					email,
					timestamp: admin.firestore.FieldValue.serverTimestamp()
				});

			return res.status(200).json({ success: true });
		} catch (error) {
			console.error("Newsletter subscription error:", error);
			return res.status(500).json({ error: "Failed to process request" });
		}
	}
);
