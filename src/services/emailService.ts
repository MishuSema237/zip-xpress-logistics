import { Shipment } from './shipmentService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface EmailData extends Shipment { }

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactFormEmail = async (data: ContactFormData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send contact form email');
    }

    return await response.json();
  } catch (error) {
    console.error('Contact email error:', error);
    throw new Error('Failed to send contact form email');
  }
};

/**
 * Sends test emails (shipper & receiver) using the backend service.
 * This is used by the admin dashboard to verify email configuration.
 */
export const sendTestEmails = async (data: Partial<Shipment>) => {
  try {
    const response = await fetch(`${API_URL}/shipments/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send test emails');
      } else {
        const text = await response.text();
        console.error('Non-JSON error response:', text);
        throw new Error(`Failed to send test emails: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Test emails error:', error);
    throw new Error('Failed to send test emails');
  }
};

// Legacy support for older calls (optional, can be removed if all references are updated)
export const sendShipperEmail = sendTestEmails;
export const sendReceiverEmail = async () => { }; // No-op, handled by sendTestEmails