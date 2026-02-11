import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ShipmentPackage {
  quantity: number;
  pieceType: string;
  description: string;
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface ShipmentHistory {
  date: string;
  time: string;
  location: string;
  status: string;
  updatedBy: string;
  remarks: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;

  // Shipper Information
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;
  shipperEmail: string;

  // Receiver Information
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverEmail: string;

  // Shipment Status
  status: 'pending' | 'in_transit' | 'on_hold' | 'delivered' | 'delayed';
  currentLocation: string;
  currentLocationAddress?: string;

  // Shipment Information
  origin: string;
  originAddress?: string;
  destination: string;
  destinationAddress?: string;
  carrier: string;
  typeOfShipment: string;
  shipmentMode: string;
  packageCount: number;
  product: string;
  productQuantity: number;
  paymentMode: string;
  totalFreight: number;
  weight: number;

  // Dates and Times
  expectedDeliveryDate: string;
  departureTime: string;
  pickupDate: string;
  pickupTime: string;

  // Package Details
  packages: ShipmentPackage[];
  totalVolumetricWeight: number;
  totalVolume: number;
  totalActualWeight: number;

  // History
  shipmentHistory: ShipmentHistory[];

  // Comments
  comments: string;

  // System fields
  createdAt: string;
  updatedAt: string;
}

// Create a new shipment
export const createShipment = async (data: Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>): Promise<Shipment> => {
  try {
    const response = await fetch(`${API_URL}/shipments`, {
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
        throw new Error(errorData.message || 'Failed to create shipment');
      } else {
        const text = await response.text();
        console.error('Non-JSON error response (create):', text);
        throw new Error(`Failed to create shipment: ${response.status} ${response.statusText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Create shipment error:', error);
    throw error;
  }
};

// Get all shipments
export const getAllShipments = async (): Promise<Shipment[]> => {
  try {
    const response = await fetch(`${API_URL}/shipments`);
    if (!response.ok) {
      throw new Error('Failed to fetch shipments');
    }
    const data = await response.json();
    // Map _id to id if necessary, but mongo returns _id. Frontend expects id.
    // The backend route returns the mongoose document which has _id.
    // We should map it.
    return data.map((item: any) => ({
      ...item,
      id: item._id || item.id
    }));
  } catch (error) {
    console.error('Get shipments error:', error);
    return [];
  }
};

// Get shipment by tracking number
export const getShipmentByTracking = async (trackingNumber: string): Promise<Shipment | null> => {
  try {
    const response = await fetch(`${API_URL}/shipments/${trackingNumber}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch shipment');
      } else {
        const text = await response.text();
        console.error('Non-JSON error response (fetch):', text);
        throw new Error(`Failed to fetch shipment: ${response.status} ${response.statusText}`);
      }
    }
    const item = await response.json();
    return { ...item, id: item._id || item.id };
  } catch (error) {
    console.error('Get shipment by tracking error:', error);
    throw error;
  }
};

// Get shipment by ID
export const getShipmentById = async (id: string): Promise<Shipment | null> => {
  try {
    const response = await fetch(`${API_URL}/shipments/id/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch shipment');
    }
    const item = await response.json();
    return { ...item, id: item._id || item.id };
  } catch (error) {
    console.error('Get shipment by ID error:', error);
    throw error;
  }
};

// Update shipment
export const updateShipment = async (id: string, data: Partial<Omit<Shipment, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt'>>): Promise<Shipment> => {
  try {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update shipment');
      } else {
        const text = await response.text();
        console.error('Non-JSON error response (update):', text);
        throw new Error(`Failed to update shipment: ${response.status} ${response.statusText}`);
      }
    }

    const item = await response.json();
    return { ...item, id: item._id || item.id };
  } catch (error) {
    console.error('Update shipment error:', error);
    throw error;
  }
};

// Delete shipment
export const deleteShipment = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete shipment');
    }
  } catch (error) {
    console.error('Delete shipment error:', error);
    throw error;
  }
};

// Update tracking info
export const updateTrackingInfo = async (
  id: string,
  status: string,
  currentLocation: string,
  remarks?: string
): Promise<Shipment> => {
  // Use the unified updateShipment function to pass tracking updates to the backend.
  // The backend handles appending these to the shipment history if status/location/remarks are present.
  return updateShipment(id, {
    status: status as any,
    currentLocation,
    remarks
  } as any);
};