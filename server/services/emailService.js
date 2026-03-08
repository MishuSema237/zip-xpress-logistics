const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const { getShipperTemplate, getReceiverTemplate, getContactTemplate } = require('../utils/emailTemplates');

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Nodemailer SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.zoho.com",
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "").replace(/"/g, "") : "",
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
    },
});

const sendEmail = async (to, subject, html) => {
    console.log(`Email service: Attempting to send email to ${to}...`);

    // 1. Try SMTP first
    try {
        const fromAddress = process.env.SMTP_FROM || `"Zip Xpress" <${process.env.SMTP_USER}>`;
        const info = await transporter.sendMail({
            from: fromAddress,
            to,
            subject,
            html,
        });
        console.log(`✅ Email sent via SMTP to ${to}. MessageId: ${info.messageId}`);
        return info;
    } catch (smtpError) {
        console.error(`❌ SMTP Error for ${to}:`, smtpError.message);

        // 2. Fallback to Resend
        if (resend) {
            console.log(`🔄 Attempting fallback to Resend for ${to}...`);
            try {
                // Use onboarding@resend.dev as a secondary fallback if the primary "from" fails
                // This is necessary because Resend requires domain verification for custom addresses.
                const resendFrom = "Zip Xpress <onboarding@resend.dev>";

                const { data, error } = await resend.emails.send({
                    from: resendFrom,
                    to,
                    subject,
                    html,
                });

                if (error) {
                    console.error(`❌ Resend API Error for ${to}:`, error.message || error);
                    throw error;
                }

                console.log(`✅ Email sent via Resend fallback to ${to}. ID: ${data.id}`);
                return data;
            } catch (resendError) {
                console.error(`❌ Resend Fallback failed for ${to}:`, resendError.message || resendError);
                // If everything fails, throw the original SMTP error to the controller
                throw new Error(`Email failed (SMTP & Resend). SMTP: ${smtpError.message}, Resend: ${resendError.message}`);
            }
        }

        throw smtpError;
    }
};

const sendShipmentCreatedEmail = async (shipment) => {
    if (shipment.shipperEmail) {
        await sendEmail(
            shipment.shipperEmail,
            `Shipment Created - ${shipment.trackingNumber}`,
            getShipperTemplate(shipment)
        );
    }

    if (shipment.receiverEmail) {
        await sendEmail(
            shipment.receiverEmail,
            `Package Incoming - ${shipment.trackingNumber}`,
            getReceiverTemplate(shipment)
        );
    }
};

const sendContactEmail = async (data) => {
    await sendEmail(
        process.env.SMTP_USER, // Admin receives it
        `New Contact: ${data.subject}`,
        getContactTemplate(data)
    );
};

module.exports = {
    sendEmail,
    sendShipmentCreatedEmail,
    sendContactEmail
};
