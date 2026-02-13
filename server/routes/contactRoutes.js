const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // Send email to admin
        await sendContactEmail({ name, email, subject: subject || 'New Contact Form Submission', message });

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;
