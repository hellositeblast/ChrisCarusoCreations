// api/contact.js
// Receives website contact/trade form submissions and sends them as an
// email via the Resend API. Works for ANY client site reusing this same
// function + RESEND_API_KEY - the destination email is just whatever the
// form's hidden "to" field specifies, so no per-client dashboard setup
// is ever needed again.
//
// Required Vercel Environment Variable (set once, in Project Settings -> Environment Variables):
//   RESEND_API_KEY   your Resend API key (starts with re_...)
//
// The "from" address must be on a Resend-verified domain. This is hardcoded
// below as FROM_ADDRESS - update it if the sending domain ever changes.

const { Resend } = require("resend");
const { IncomingForm } = require("formidable");
const fs = require("fs");

// Hardcode the verified sending domain/address here.
const FROM_ADDRESS = "Website Enquiries <enquiries@siteblast.com.au>";

// Vercel needs raw body access for multipart/form-data (file uploads),
// so we disable the default JSON body parser for this route.
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: true,
      maxFileSize: 15 * 1024 * 1024, // 15MB per file cap
      allowEmptyFiles: true, // attachment field is optional - don't error when no file is selected
      minFileSize: 0,
    });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = async function handler(req, res) {
  // CORS - allow the form to be submitted from any client site's browser
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    // formidable v3 wraps every field in an array; normalize to plain values
    const getField = (name) => {
      const v = fields[name];
      if (Array.isArray(v)) return v[0];
      return v;
    };

    // Honeypot bot-check field - if filled in, silently pretend success
    const botcheck = getField("botcheck");
    if (botcheck) {
      return res.status(200).json({ success: true });
    }

    // "to" is the ONLY thing that needs to differ between client sites -
    // every site's form just sets this hidden field to that client's email.
    const to = getField("to");
    if (!to) {
      return res.status(400).json({ success: false, message: "Missing recipient (to field)" });
    }

    const name = getField("name") || "Not provided";
    const phone = getField("phone") || "Not provided";
    const email = getField("email") || "Not provided";
    const company = getField("company") || "";
    const projectType = getField("project_type") || getField("trade_type") || "Not specified";
    const message = getField("message") || "No message provided";
    const subject = getField("subject") || "New Website Enquiry";
    const fromName = getField("from_name") || "Website Enquiry";

    const textBody = [
      `New enquiry from ${fromName}`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      `Project Type: ${projectType}`,
      ``,
      `Message:`,
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const htmlBody = `
      <h2>New enquiry from ${escapeHtml(fromName)}</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
      <p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
      <p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    // Handle attachments (file inputs use name="attachment", possibly multiple)
    const attachments = [];
    const fileField = files.attachment;
    const fileList = Array.isArray(fileField) ? fileField : fileField ? [fileField] : [];
    for (const f of fileList) {
      if (f && f.filepath && f.size > 0) {
        const content = fs.readFileSync(f.filepath);
        attachments.push({
          filename: f.originalFilename || "attachment",
          content,
        });
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      replyTo: email !== "Not provided" ? email : undefined,
      subject,
      text: textBody,
      html: htmlBody,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ success: false, message: "Failed to send email" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
};
