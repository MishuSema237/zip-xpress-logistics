const nodemailer = require('nodemailer');
const { getShipperTemplate, getReceiverTemplate, getContactTemplate } = require('../utils/emailTemplates');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
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
