const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const { getShipperTemplate, getReceiverTemplate, getContactTemplate } = require('../utils/emailTemplates');

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Nodemailer SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.zoho.com",
    port: 465, // Explicitly use 465 for better reliability on cloud platforms
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "").replace(/"/g, "") : "",
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,    // 5 seconds
    socketTimeout: 15000,     // 15 seconds
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
        console.error(`❌ SMTP Error details for ${to}:`, {
            message: smtpError.message,
            code: smtpError.code,
            command: smtpError.command,
            response: smtpError.response,
            stack: smtpError.stack
        });

        // 2. Fallback to Resend
        if (resend) {
            console.log(`🔄 Attempting fallback to Resend for ${to}...`);
            try {
                // Use the configured FROM address if available, otherwise fallback to the user email
                const resendFrom = process.env.SMTP_FROM || `"Zip Xpress" <${process.env.SMTP_USER}>`;

                const response = await resend.emails.send({
                    from: resendFrom,
                    to,
                    subject,
                    html,
                });

                if (response.error) {
                    // Check if it's the "onboarding@resend.dev" error and provide advice if so
                    if (response.error.message && response.error.message.includes('onboarding@resend.dev')) {
                         console.error(`❌ Resend Error: It seems like Resend is still restricted. Ensure ${resendFrom} is part of your verified domain.`);
                    }
                    console.error(`❌ Resend API Error for ${to}:`, response.error.message || response.error);
                    throw response.error;
                }

                console.log(`✅ Email sent via Resend fallback to ${to}. ID: ${response.data.id}`);
                return response.data;
            } catch (resendError) {
                console.error(`❌ Resend Fallback failed for ${to}:`, resendError.message || resendError);
                throw new Error(`Email failed (SMTP & Resend). SMTP: ${smtpError.message}, Resend: ${resendError.message}`);
            }
        }

        throw new Error(`SMTP Error: ${smtpError.message}${smtpError.code ? ` (${smtpError.code})` : ''}`);
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
