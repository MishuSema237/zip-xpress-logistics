const getBaseStyles = () => `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background-color: #374895; padding: 20px; text-align: center; }
  .header h1 { color: #fff; margin: 0; }
  .content { padding: 20px; background-color: #fff; }
  .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
  .button { display: inline-block; padding: 10px 20px; background-color: #374895; color: #fff; text-decoration: none; border-radius: 5px; }
  .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
  .label { font-weight: bold; color: #555; }
`;

const getShipperTemplate = (data) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>${getBaseStyles()}</style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Shipment Created</h1>
      </div>
      <div class="content">
        <p>Hello ${data.shipperName},</p>
        <p>Your shipment has been successfully created. Here are the details:</p>
        
        <table class="info-table">
          <tr><td class="label">Tracking Number:</td><td>${data.trackingNumber}</td></tr>
          <tr><td class="label">Status:</td><td>${data.status}</td></tr>
          <tr><td class="label">Origin:</td><td>${data.origin}</td></tr>
          <tr><td class="label">Destination:</td><td>${data.destination}</td></tr>
        </table>
        
        <p>You can track your shipment at any time by clicking the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track/${data.trackingNumber}" class="button">Track Shipment</a>
        </div>
        
        <p>Thank you for choosing Zip Xpress!</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Zip Xpress. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const getReceiverTemplate = (data) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>${getBaseStyles()}</style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Package Incoming</h1>
      </div>
      <div class="content">
        <p>Hello ${data.receiverName},</p>
        <p>A package is on its way to you from ${data.shipperName}.</p>
        
        <table class="info-table">
          <tr><td class="label">Tracking Number:</td><td>${data.trackingNumber}</td></tr>
          <tr><td class="label">Expected Delivery:</td><td>${data.expectedDeliveryDate || 'Pending'}</td></tr>
        </table>
        
        <p>You can track the progress of your package here:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/track/${data.trackingNumber}" class="button">Track Package</a>
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Zip Xpress. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;

const getContactTemplate = (data) => `
  <!DOCTYPE html>
  <html>
  <head>
    <style>${getBaseStyles()}</style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="content">
        <table class="info-table">
          <tr><td class="label">Name:</td><td>${data.name}</td></tr>
          <tr><td class="label">Email:</td><td>${data.email}</td></tr>
          <tr><td class="label">Subject:</td><td>${data.subject}</td></tr>
        </table>
        
        <h3>Message:</h3>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          ${data.message.replace(/\n/g, '<br>')}
        </p>
      </div>
    </div>
  </body>
  </html>
`;

module.exports = {
    getShipperTemplate,
    getReceiverTemplate,
    getContactTemplate
};
