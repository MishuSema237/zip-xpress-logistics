const generateTrackingNumber = () => {
    const prefix = 'ZXI';
    // Generate 9 random digits. 
    // Math.random() gives 0 to <1. multiplied by 10^9 gives up to 9 digits (maybe less if leading zeros).
    // PadStart ensures 9 digits.
    const randomNum = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `${prefix}${randomNum}`;
};

module.exports = generateTrackingNumber;
