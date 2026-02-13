const nodemailer = require('nodemailer');
const { getShipperTemplate, getReceiverTemplate, getContactTemplate } = require('../utils/emailTemplates');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps with some hosting provider restrictions
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`Attempting to send email to: ${to}`);
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html
        });
        console.log('Message sent successfully: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error Details:', {
            code: error.code,
            command: error.command,
            responseCode: error.responseCode,
            stack: error.stack
        });
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
    // Send to Admin
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
