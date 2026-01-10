const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

admin.initializeApp();

const contactRateLimitMap = new Map();
const newsletterRateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;
const NEWSLETTER_RATE_LIMIT_MAX_REQUESTS = 3;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
      .map(origin => origin.trim())
      .filter(Boolean)
  : [];

function applyCors(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.length > 0) {
    if (origin && !allowedOrigins.includes(origin)) {
      res.status(403).json({ error: 'Origin not allowed' });
      return false;
    }
    res.set('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
    res.set('Vary', 'Origin');
  } else {
    res.set('Access-Control-Allow-Origin', '*');
  }

  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  return true;
}

function getRateLimitKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
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

const gmailUser = defineSecret('GMAIL_USER', { required: false });
const gmailPassword = defineSecret('GMAIL_APP_PASSWORD', { required: false });
const contactEmail = defineSecret('CONTACT_EMAIL', { required: false });

// Helper to send email
async function sendPortalEmail(to, subject, templateName, data) {
  const user = gmailUser.value();
  const pass = gmailPassword.value();

  if (!user || !pass) {
    console.log('Email skipped: GMAIL_USER or GMAIL_APP_PASSWORD not set.');
    return;
  }

  try {
    const baseTemplate = fs.readFileSync(path.join(__dirname, 'emails', 'base.html'), 'utf8');
    const contentTemplate = fs.readFileSync(
      path.join(__dirname, 'emails', `${templateName}.html`),
      'utf8'
    );

    // Simple mustache-like replacement
    let body = contentTemplate;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      body = body.replace(regex, data[key]);
    });

    // Handle triple braces for unescaped content if needed (like the body in base)
    let html = baseTemplate.replace('{{{body}}}', body);
    html = html.replace('{{title}}', subject);
    html = html.replace('{{year}}', new Date().getFullYear());

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"CartShift Studio" <${user}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Helper to generate and upload invoice PDF
async function saveInvoicePDF(request) {
  try {
    const orgSnap = await admin
      .firestore()
      .collection('portal_organizations')
      .doc(request.orgId)
      .get();
    if (!orgSnap.exists) return;
    const organization = orgSnap.data();

    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header - Simplified design for PDFKit compatibility
      doc.fillColor('#2563eb').fontSize(24).text('CartShift Studio', 50, 50);
      doc.fillColor('#6b7280').fontSize(10).text('Premium E-commerce Development', 50, 80);

      doc.fillColor('#111827').fontSize(20).text('INVOICE', 400, 50, { align: 'right' });
      doc
        .fillColor('#6b7280')
        .fontSize(10)
        .text(`#INV-${request.id.substring(0, 8).toUpperCase()}`, 400, 75, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 90, { align: 'right' });

      doc.moveDown(3);

      // Info Section
      const y1 = doc.y;
      doc.fillColor('#6b7280').fontSize(10).text('FROM', 50, y1);
      doc.fillColor('#1a1a1a').text('CartShift Studio', 50, y1 + 15);
      doc.text('Tel Aviv, Israel', 50, y1 + 30);
      doc.text('support@cart-shift.com', 50, y1 + 45);

      doc.fillColor('#6b7280').text('BILL TO', 350, y1);
      doc.fillColor('#1a1a1a').text(organization.name, 350, y1 + 15);
      doc.text(`Org ID: ${request.orgId}`, 350, y1 + 30);
      if (organization.website) doc.text(organization.website, 350, y1 + 45);

      doc.moveDown(4);

      // Table Header
      const tableY = doc.y;
      doc.fillColor('#6b7280').fontSize(9).text('DESCRIPTION', 50, tableY);
      doc.text('QTY', 350, tableY, { width: 50, align: 'center' });
      doc.text('PRICE', 400, tableY, { width: 70, align: 'right' });
      doc.text('TOTAL', 470, tableY, { width: 70, align: 'right' });

      doc
        .moveTo(50, tableY + 15)
        .lineTo(540, tableY + 15)
        .strokeColor('#e5e7eb')
        .stroke();

      // Table Items
      let y = tableY + 25;
      const currency = request.currency === 'ILS' ? '₪' : '$';
      const items = request.lineItems || [
        { description: request.title, quantity: 1, unitPrice: request.totalAmount || 0 },
      ];

      items.forEach(item => {
        doc.fillColor('#111827').fontSize(10).text(item.description, 50, y);
        doc.text(item.quantity.toString(), 350, y, { width: 50, align: 'center' });
        doc.text(`${currency}${(item.unitPrice / 100).toLocaleString()}`, 400, y, {
          width: 70,
          align: 'right',
        });
        doc.text(
          `${currency}${((item.quantity * item.unitPrice) / 100).toLocaleString()}`,
          470,
          y,
          { width: 70, align: 'right' }
        );
        y += 20;
      });

      doc.moveTo(50, y).lineTo(540, y).strokeColor('#e5e7eb').stroke();
      doc.moveDown(2);

      // Summary
      const total = (request.totalAmount || 0) / 100;
      doc
        .fillColor('#111827')
        .fontSize(10)
        .text('Total Paid', 350, doc.y, { width: 100, align: 'right' });
      doc
        .fontSize(14)
        .fillColor('#2563eb')
        .text(`${currency}${total.toLocaleString()}`, 450, doc.y - 4, {
          width: 90,
          align: 'right',
        });

      // Footer
      doc
        .fontSize(8)
        .fillColor('#9ca3af')
        .text('Thank you for your business. Generated by CartShift Studio Portal.', 50, 750, {
          align: 'center',
        });

      doc.end();
    });

    // Upload to Storage
    const bucket = admin.storage().bucket();
    const filePath = `portal_invoices/${request.orgId}/${request.id}.pdf`;
    const file = bucket.file(filePath);

    await file.save(pdfBuffer, {
      contentType: 'application/pdf',
      metadata: {
        firebaseStorageDownloadTokens: request.id, // Fixed token for easier access if public, or just use signed URLs
      },
    });

    // Update Request with Invoice URL (signed URL or standard path)
    await admin.firestore().collection('portal_requests').doc(request.id).update({
      invoicePath: filePath,
      invoiceGeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Invoice saved for request ${request.id} at ${filePath}`);
  } catch (error) {
    console.error('Error generating/saving invoice:', error);
  }
}

async function getUserEmail(userId) {
  const userSnap = await admin.firestore().collection('portal_users').doc(userId).get();
  return userSnap.exists ? userSnap.data().email : null;
}

exports.contactForm = onRequest(
  {
    cors: true,
    maxInstances: 10,
    secrets: [gmailUser, gmailPassword, contactEmail],
  },
  async (req, res) => {
    if (!applyCors(req, res)) {
      return;
    }

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const rateLimitKey = getRateLimitKey(req);
      if (!checkRateLimit(contactRateLimitMap, rateLimitKey, CONTACT_RATE_LIMIT_MAX_REQUESTS)) {
        res.set('Retry-After', '60');
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      const { name, email, interest, message, company, projectType } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const emailContent = `
New contact form submission from CartShift Studio website:

Name: ${name}
Email: ${email}
${interest ? `Interest: ${interest}` : ''}
${company ? `Company: ${company}` : ''}
${projectType ? `Project Type: ${projectType}` : ''}
${message ? `Message: ${message}` : ''}
      `.trim();

      const nodemailer = require('nodemailer');

      if (gmailUser.value() && gmailPassword.value()) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser.value(),
            pass: gmailPassword.value(),
          },
        });

        const mailOptions = {
          from: gmailUser.value(),
          to: contactEmail.value() || 'hello@cart-shift.com',
          subject: `New Contact Form Submission from ${name}`,
          text: emailContent,
        };

        await transporter.sendMail(mailOptions);
      }

      await admin
        .firestore()
        .collection('contact_submissions')
        .add({
          name,
          email,
          interest: interest || null,
          message: message || null,
          company: company || null,
          projectType: projectType || null,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({ error: 'Failed to process request' });
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

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const rateLimitKey = getRateLimitKey(req);
      if (
        !checkRateLimit(newsletterRateLimitMap, rateLimitKey, NEWSLETTER_RATE_LIMIT_MAX_REQUESTS)
      ) {
        res.set('Retry-After', '60');
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      }

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      await admin.firestore().collection('newsletter_subscriptions').add({
        email,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return res.status(500).json({ error: 'Failed to process request' });
    }
  }
);

// ============================================
// PORTAL NOTIFICATION TRIGGERS
// ============================================

const PORTAL_BASE_URL = 'https://cart-shift.com/portal';

// 1. New Request Trigger (Notify Admin)
exports.onPortalRequestCreated = onDocumentCreated(
  { document: 'portal_requests/{requestId}', secrets: [gmailUser, gmailPassword, contactEmail] },
  async event => {
    const requestData = event.data.data();
    const orgSnap = await admin
      .firestore()
      .collection('portal_organizations')
      .doc(requestData.orgId)
      .get();
    const orgName = orgSnap.exists ? orgSnap.data().name : 'Unknown Organization';

    await sendPortalEmail(
      contactEmail.value() || 'hello@cart-shift.com',
      `New Request: ${requestData.title}`,
      'new_request',
      {
        clientName: requestData.createdByName || 'A client',
        organizationName: orgName,
        requestTitle: requestData.title,
        requestDescription: requestData.description,
        requestType: requestData.type,
        requestPriority: requestData.priority,
        actionUrl: `${PORTAL_BASE_URL}/org/${requestData.orgId}/requests/${event.params.requestId}`,
      }
    );
  }
);

// 2. Request Updated Trigger (Notify Client on Status Change / Quote)
exports.onPortalRequestUpdated = onDocumentUpdated(
  { document: 'portal_requests/{requestId}', secrets: [gmailUser, gmailPassword] },
  async event => {
    const oldData = event.data.before.data();
    const newData = event.data.after.data();

    const clientEmail = await getUserEmail(newData.createdBy);
    if (!clientEmail) return;

    const requestUrl = `${PORTAL_BASE_URL}/org/${newData.orgId}/requests/${event.params.requestId}`;

    // Detect Status Change
    if (oldData.status !== newData.status) {
      const statusConfigs = {
        IN_PROGRESS: { label: 'In Progress', style: 'background: #dbeafe; color: #1e40af;' },
        IN_REVIEW: { label: 'In Review', style: 'background: #fef3c7; color: #92400e;' },
        DELIVERED: { label: 'Delivered', style: 'background: #d1fae5; color: #065f46;' },
        PAID: { label: 'Paid', style: 'background: #ecfdf5; color: #065f46;' },
        CLOSED: { label: 'Closed', style: 'background: #f1f5f9; color: #475569;' },
      };

      const config = statusConfigs[newData.status];
      if (config) {
        await sendPortalEmail(clientEmail, `Update: ${newData.title}`, 'status_update', {
          requestTitle: newData.title,
          statusLabel: config.label,
          statusStyle: config.style,
          actionUrl: requestUrl,
        });
      }
    }

    // 2. Detect Milestone Completion
    if (newData.milestones && Array.isArray(newData.milestones)) {
      const oldMilestones = oldData.milestones || [];
      newData.milestones.forEach((m, index) => {
        const oldM = oldMilestones[index];
        if (m.status === 'completed' && (!oldM || oldM.status !== 'completed')) {
          sendPortalEmail(clientEmail, `Milestone Completed: ${m.title}`, 'milestone_completed', {
            requestTitle: newData.title,
            milestoneTitle: m.title,
            actionUrl: requestUrl,
          });
        }
      });
    }

    // 3. Detect Quote added (New Quote)
    if (!oldData.isBillable && newData.isBillable && newData.status === 'QUOTED') {
      const currencySymbol = newData.currency === 'ILS' ? '₪' : '$';
      const totalFormatted = `${currencySymbol}${(newData.totalAmount / 100).toLocaleString()}`;

      await sendPortalEmail(clientEmail, `New Quote: ${newData.title}`, 'quote_received', {
        requestTitle: newData.title,
        totalAmount: totalFormatted,
        actionUrl: requestUrl,
      });
    }

    // Detect Payment (Paid)
    if (!oldData.paidAt && newData.paidAt) {
      const currencySymbol = newData.currency === 'ILS' ? '₪' : '$';
      const totalFormatted = `${currencySymbol}${(newData.totalAmount / 100).toLocaleString()}`;

      await sendPortalEmail(clientEmail, `Payment Received: ${newData.title}`, 'payment_receipt', {
        requestTitle: newData.title,
        totalAmount: totalFormatted,
        paymentId: newData.paymentId || 'N/A',
        actionUrl: requestUrl,
      });

      // Generate and store Invoice PDF
      await saveInvoicePDF(newData);
    }
  }
);

// 3. New Comment Trigger
exports.onPortalCommentCreated = onDocumentCreated(
  { document: 'portal_comments/{commentId}', secrets: [gmailUser, gmailPassword, contactEmail] },
  async event => {
    const commentData = event.data.data();
    if (commentData.isInternal) return; // Don't notify for internal comments

    const requestSnap = await admin
      .firestore()
      .collection('portal_requests')
      .doc(commentData.requestId)
      .get();
    if (!requestSnap.exists) return;
    const requestData = requestSnap.data();

    const authorId = commentData.userId;
    const isAgencyAuthor = authorId === 'agency' || authorId.includes('agency'); // Rough check, improved below

    // Try to find if the user is agency
    const authorSnap = await admin.firestore().collection('portal_users').doc(authorId).get();
    const isAgency = authorSnap.exists ? authorSnap.data().isAgency : false;

    const targetEmail = isAgency
      ? await getUserEmail(requestData.createdBy) // Agency commented -> Notify client
      : contactEmail.value() || 'hello@cart-shift.com'; // Client commented -> Notify admin

    if (!targetEmail) return;

    await sendPortalEmail(targetEmail, `New message: ${requestData.title}`, 'new_comment', {
      userName: commentData.userName,
      requestTitle: requestData.title,
      commentText: commentData.content,
      actionUrl: `${PORTAL_BASE_URL}/org/${commentData.orgId}/requests/${commentData.requestId}`,
    });
  }
);

// ============================================
// GOOGLE CALENDAR OAUTH CALLBACK
// ============================================

const googleClientId = defineSecret('GOOGLE_CLIENT_ID', { required: false });
const googleClientSecret = defineSecret('GOOGLE_CLIENT_SECRET', { required: false });

exports.googleCalendarOAuthCallback = onRequest(
  {
    cors: true,
    maxInstances: 10,
    secrets: [googleClientId, googleClientSecret],
  },
  async (req, res) => {
    if (!applyCors(req, res)) {
      return;
    }

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const clientId = googleClientId.value();
      const clientSecret = googleClientSecret.value();

      if (!clientId || !clientSecret) {
        console.error('[Google Calendar] Missing OAuth credentials');
        return res.status(500).json({
          success: false,
          message: 'Google OAuth not configured',
        });
      }

      const { code, redirectUri } = req.body;

      if (!code || !redirectUri) {
        console.error('[Google Calendar] Missing parameters:', {
          hasCode: !!code,
          hasRedirectUri: !!redirectUri,
        });
        return res.status(400).json({
          success: false,
          message: 'Missing code or redirectUri',
        });
      }

      console.log('[Google Calendar] Exchanging code for tokens');
      console.log('[Google Calendar] Redirect URI:', redirectUri);
      console.log('[Google Calendar] Client ID:', clientId.substring(0, 20) + '...');
      console.log('[Google Calendar] Code length:', code?.length || 0);

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('[Google Calendar] Token exchange error:', errorText);
        let errorMessage = 'Failed to exchange code for tokens';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error_description || errorJson.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        return res.status(400).json({
          success: false,
          message: errorMessage,
        });
      }

      const tokens = await tokenResponse.json();

      return res.status(200).json({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_in: tokens.expires_in,
        scope: tokens.scope,
      });
    } catch (error) {
      console.error('[Google Calendar] Callback API error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
);

// ============================================
// GOOGLE CALENDAR HELPERS
// ============================================

// Helper to verify Firebase ID Token
async function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

// Helper to get a valid Google access token (refreshes if needed)
async function getValidGoogleToken(userId) {
  const integrationDoc = await admin
    .firestore()
    .collection('agency_integrations')
    .doc(`${userId}_google_calendar`)
    .get();
  if (!integrationDoc.exists) {
    throw new Error('Google Calendar not connected');
  }

  const data = integrationDoc.data();
  const now = Date.now();

  // Check if tokenExpiry exists and is a Timestamp
  let expiry = 0;
  if (data.tokenExpiry && typeof data.tokenExpiry.toDate === 'function') {
    expiry = data.tokenExpiry.toDate().getTime();
  } else if (data.tokenExpiry) {
    expiry = new Date(data.tokenExpiry).getTime();
  }

  // If token is still valid (with 5 min buffer), return it
  if (expiry > now + 5 * 60 * 1000) {
    return {
      accessToken: data.accessToken,
      selectedCalendarId: data.selectedCalendarId || 'primary',
    };
  }

  // Otherwise, refresh it
  if (!data.refreshToken) {
    throw new Error('Token expired and no refresh token available');
  }

  console.log(`Refreshing Google token for user ${userId}`);
  const clientId = googleClientId.value();
  const clientSecret = googleClientSecret.value();

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured on server');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: data.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token refresh failed:', errorText);
    throw new Error('Failed to refresh Google token');
  }

  const tokens = await response.json();
  const accessToken = tokens.access_token;
  const newExpiry = new Date(now + tokens.expires_in * 1000);

  // Update Firestore
  await integrationDoc.ref.update({
    accessToken: accessToken,
    tokenExpiry: admin.firestore.Timestamp.fromDate(newExpiry),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    accessToken,
    selectedCalendarId: data.selectedCalendarId || 'primary',
  };
}

// ============================================
// GOOGLE CALENDAR API ROUTES
// ============================================

// 1. List Calendars
exports.googleCalendarListCalendars = onRequest(
  { cors: true, maxInstances: 5, secrets: [googleClientId, googleClientSecret] },
  async (req, res) => {
    if (!applyCors(req, res)) return;
    if (req.method === 'OPTIONS') return res.status(204).send('');

    try {
      const userId = await verifyAuth(req);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { accessToken } = await getValidGoogleToken(userId);

      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      const calendars = (data.items || []).map(item => ({
        id: item.id,
        summary: item.summary,
        primary: item.primary || false,
        backgroundColor: item.backgroundColor,
      }));

      return res.status(200).json({ calendars });
    } catch (error) {
      console.error('List calendars error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
);

// 2. Create Event
exports.googleCalendarCreateEvent = onRequest(
  { cors: true, maxInstances: 5, secrets: [googleClientId, googleClientSecret] },
  async (req, res) => {
    if (!applyCors(req, res)) return;
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
      const userId = await verifyAuth(req);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { accessToken, selectedCalendarId } = await getValidGoogleToken(userId);
      const eventData = req.body;

      const googleEvent = {
        summary: eventData.title,
        description: eventData.description,
        start: { dateTime: eventData.startTime },
        end: { dateTime: eventData.endTime },
        attendees: eventData.attendees ? eventData.attendees.map(email => ({ email })) : [],
        location: eventData.location,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      };

      const calendarId = encodeURIComponent(selectedCalendarId || 'primary');
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleEvent),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      return res.status(200).json({
        eventId: data.id,
        meetLink: data.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri,
      });
    } catch (error) {
      console.error('Create event error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
);

// 3. Get Free/Busy Intervals
exports.googleCalendarGetFreeBusy = onRequest(
  { cors: true, maxInstances: 5, secrets: [googleClientId, googleClientSecret] },
  async (req, res) => {
    if (!applyCors(req, res)) return;
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
      const userId = await verifyAuth(req);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { accessToken, selectedCalendarId } = await getValidGoogleToken(userId);
      const { timeMin, timeMax } = req.body;

      if (!timeMin || !timeMax) {
        return res.status(400).json({ error: 'Missing timeMin or timeMax' });
      }

      const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: selectedCalendarId || 'primary' }],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      const busySlots = data.calendars?.[selectedCalendarId || 'primary']?.busy || [];

      return res.status(200).json({ busy: busySlots });
    } catch (error) {
      console.error('Free/busy error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
);

// 4. Delete Event
exports.googleCalendarDeleteEvent = onRequest(
  { cors: true, maxInstances: 5, secrets: [googleClientId, googleClientSecret] },
  async (req, res) => {
    if (!applyCors(req, res)) return;
    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
      const userId = await verifyAuth(req);
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { eventId, calendarId } = req.body;
      if (!eventId) {
        return res.status(400).json({ error: 'Missing eventId' });
      }

      const { accessToken } = await getValidGoogleToken(userId);
      const targetCalendar = calendarId ? encodeURIComponent(calendarId) : 'primary';

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${targetCalendar}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // 204 No Content is success for DELETE
      if (
        !response.ok &&
        response.status !== 204 &&
        response.status !== 404 &&
        response.status !== 410
      ) {
        // 410 = GONE (already deleted)
        const error = await response.json();
        return res.status(response.status).json(error);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete event error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
);
