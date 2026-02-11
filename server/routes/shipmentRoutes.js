const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const generateTrackingNumber = require('../utils/tracking');
const { sendShipmentCreatedEmail } = require('../services/emailService');

// Create Shipment
router.post('/', async (req, res) => {
    try {
        const shipmentData = req.body;

        // Generate ZXI tracking number
        let unique = false;
        let trackingNumber = '';
        while (!unique) {
            trackingNumber = generateTrackingNumber();
            const existing = await Shipment.findOne({ trackingNumber });
            if (!existing) unique = true;
        }

        const newShipment = new Shipment({
            ...shipmentData,
            trackingNumber
        });

        const savedShipment = await newShipment.save();

        // Send email (async, don't block response)
        try {
            sendShipmentCreatedEmail(savedShipment).catch(err => console.error('Email background error:', err));
        } catch (e) {
            console.error('Email trigger error:', e);
        }

        res.status(201).json(savedShipment);
    } catch (error) {
        console.error('Create shipment error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Test Email
router.post('/test-email', async (req, res) => {
    try {
        const shipment = req.body;
        await sendShipmentCreatedEmail(shipment);
        res.json({ success: true, message: 'Test emails sent successfully' });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ message: 'Failed to send test emails' });
    }
});

// Get Shipment by ID
router.get('/id/:id', async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        res.json(shipment);
    } catch (error) {
        console.error('Get shipment by ID error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get All Shipments
router.get('/', async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        console.error('Get shipments error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Shipment by Tracking Number
router.get('/:trackingNumber', async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        res.json(shipment);
    } catch (error) {
        console.error('Get shipment error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Shipment
router.put('/:id', async (req, res) => {
    try {
        const { status, currentLocation, remarks } = req.body;
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        if (status) shipment.status = status;
        if (currentLocation) shipment.currentLocation = currentLocation;

        // Update history
        if (status || currentLocation || remarks) {
            shipment.shipmentHistory.push({
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString(),
                location: currentLocation || shipment.currentLocation,
                status: status || shipment.status,
                remarks: remarks || '',
                updatedBy: 'Admin' // TODO: Get actual user if auth is implemented
            });
        }

        // Merge other updates
        Object.assign(shipment, req.body);

        const updatedShipment = await shipment.save();
        res.json(updatedShipment);
    } catch (error) {
        console.error('Update shipment error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete Shipment
router.delete('/:id', async (req, res) => {
    try {
        const shipment = await Shipment.findByIdAndDelete(req.params.id);
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        res.json({ message: 'Shipment removed' });
    } catch (error) {
        console.error('Delete shipment error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
