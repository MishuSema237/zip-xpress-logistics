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

// Get shipment by ID - Note: Backend route for get by ID is same as tracking? 
// No, the backend route `/:trackingNumber` searches by trackingNumber.
// We don't have a specific `/:id` GET route in the backend snippet I saw!
// The backend had `router.get('/:trackingNumber', ...)` finding by `trackingNumber`.
// And `router.put('/:id')`.
// So `getShipmentById` might fail if I use the same route or I need to add a route or filter on client side.
// However, in `getAllShipments` we get everything.
// For now, let's assume we can use `getAllShipments` and find by ID, OR implementation of `getShipmentById` needs to be checked.
// Actually, I should probably add `GET /id/:id` to backend or similar if needed.
// But mostly we need by tracking number for public tracking, and All for admin.
// Admin might need by ID for editing.
// Let's implement `getShipmentById` by filtering `getAllShipments` for now to be safe, or assume ID is passed as tracking number? No.
// Let's update `getShipmentById` to fetch all and find, OR just return null if not critical. 
// Actually, `AdministrationAndDevelopment.tsx` uses `getAllShipments` mostly. `updateShipment` uses ID.
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
  // This essentially calls updateShipment with specific fields.
  // The backend PUT /:id handles history update if status/location/remarks are present.
  return updateShipment(id, { status: status as any, currentLocation, comments: remarks });
  // Note: 'remarks' was mapped to 'comments' in backend? No, 'remarks' is in history.
  // Backend `PUT /:id` expects `status`, `currentLocation`, `remarks` in body to update history.
  // So we pass them.
  try {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, currentLocation, remarks }),
    });

    if (!response.ok) {
      throw new Error('Failed to update tracking info');
    }
    const item = await response.json();
    return { ...item, id: item._id || item.id };
  } catch (error) {
    console.error('Update tracking info error:', error);
    throw error;
  }
}; 