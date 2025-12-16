const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const gmailUser = defineSecret("GMAIL_USER");
const gmailPassword = defineSecret("GMAIL_APP_PASSWORD");
const contactEmail = defineSecret("CONTACT_EMAIL");

exports.contactForm = onRequest(
	{
		cors: true,
		maxInstances: 10,
		secrets: [gmailUser, gmailPassword, contactEmail]
	},
	async (req, res) => {
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.set("Access-Control-Allow-Headers", "Content-Type");

		if (req.method === "OPTIONS") {
			res.status(204).send("");
			return;
		}

		if (req.method !== "POST") {
			return res.status(405).json({ error: "Method not allowed" });
		}

		try {
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
