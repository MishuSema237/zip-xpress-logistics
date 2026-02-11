const mongoose = require('mongoose');

const shipmentPackageSchema = new mongoose.Schema({
    quantity: Number,
    pieceType: String,
    description: String,
    length: Number,
    width: Number,
    height: Number,
    weight: Number
});

const shipmentHistorySchema = new mongoose.Schema({
    date: String,
    time: String,
    location: String,
    status: String,
    updatedBy: String,
    remarks: String
});

const shipmentSchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },

    // Shipper Information
    shipperName: String,
    shipperAddress: String,
    shipperPhone: String,
    shipperEmail: String,

    // Receiver Information
    receiverName: String,
    receiverAddress: String,
    receiverPhone: String,
    receiverEmail: String,

    // Shipment Status
    status: {
        type: String,
        enum: ['pending', 'in_transit', 'on_hold', 'delivered', 'delayed', 'Pending', 'In Transit', 'On Hold', 'Delivered', 'Delayed'], // Supporting both casing for robust migration
        default: 'pending'
    },
    currentLocation: String,

    // Shipment Information
    origin: String,
    destination: String,
    carrier: String,
    typeOfShipment: String, // Also called shipmentType in some contexts
    shipmentMode: String,
    packageCount: Number,
    product: String,
    productQuantity: Number,
    paymentMode: String,
    totalFreight: Number,
    weight: Number,

    // Dates and Times
    expectedDeliveryDate: String,
    departureTime: String,
    pickupDate: String,
    pickupTime: String,

    // Package Details
    packages: [shipmentPackageSchema],

    // Deprecated/Legacy fields supported for unified schema
    quantity: String, // from trackingService
    pieceType: String,
    description: String,
    length: String,
    width: String,
    height: String,
    // Note: we can use the 'packages' array for new data, but these might exist in legacy tracking logic. 
    // We'll keep the schema flexible.

    totalVolumetricWeight: Number,
    totalVolume: Number,
    totalActualWeight: Number,

    // History
    shipmentHistory: [shipmentHistorySchema],

    // Comments
    comments: String,

    // System fields
}, {
    timestamps: true
});

module.exports = mongoose.model('Shipment', shipmentSchema);
