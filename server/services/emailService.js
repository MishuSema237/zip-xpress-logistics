const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const { getShipperTemplate, getReceiverTemplate, getContactTemplate } = require('../utils/emailTemplates');

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Initialize Nodemailer SMTP fallback
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async (to, subject, html) => {
    // Try Resend first in production or if API key is available
    if (resend && process.env.NODE_ENV === 'production') {
        try {
            console.log(`[Resend] Attempting to send email to: ${to}`);
            const { data, error } = await resend.emails.send({
                from: process.env.SMTP_FROM || 'Zip Xpress <onboarding@resend.dev>',
                to,
                subject,
                html
            });

            if (error) {
                console.error('[Resend] Error:', error);
                throw error;
            }

            console.log('[Resend] Message sent successfully:', data.id);
            return data;
        } catch (error) {
            console.error('[Resend] Failed, falling back to SMTP:', error.message);
            // If Resend fails, it falls through to SMTP below
        }
    }

    // SMTP Fallback (Local development or if Resend fails)
    try {
        console.log(`[SMTP] Attempting to send email to: ${to}`);
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html
        });
        console.log('[SMTP] Message sent successfully: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('[SMTP] Error:', error.message);
        throw error;
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
