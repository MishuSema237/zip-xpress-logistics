import {
  createShipment,
  getAllShipments,
  getShipmentByTracking,
  updateShipment,
  deleteShipment,
  Shipment,
  updateTrackingInfo
} from './shipmentService';

// Re-export types that might be needed or alias them
// The Admin.tsx uses TrackingDetails interface which has different fields.
// We need to map between Shipment and TrackingDetails if we want to keep Admin.tsx working without changing it.
// Or we can just try to make them compatible.
// Admin.tsx expects 'TrackingDetails'
export interface TrackingDetails {
  id: string;
  trackingNumber: string;
  shipperName: string;
  shipperAddress: string;
  shipperPhone: string;
  shipperEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverEmail: string;
  origin: string;
  destination: string;
  carrier: string;
  shipmentType: string;
  shipmentMode: string;
  product: string;
  productQuantity: string; // Admin payload uses string? Shipment uses number.
  paymentMode: string;
  totalFreight: string; // Admin uses string?
  expectedDeliveryDate: string;
  departureTime: string;
  pickupDate: string;
  pickupTime: string;
  quantity: string;
  pieceType: string;
  description: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  comments: string;
  status: string;
  currentLocation: string;
  lastUpdated: string;
}

export type CreateTrackingData = Omit<TrackingDetails, 'id' | 'trackingNumber' | 'lastUpdated' | 'currentLocation'>;
export type UpdateTrackingData = Partial<CreateTrackingData>;

// Helper to map TrackingDetails to Shipment (for creation/update)
const mapTrackingToShipment = (data: any): any => {
  // We need to construct the 'packages' array from individual fields if they exist
  const packages = [{
    quantity: parseInt(data.quantity || '0'),
    pieceType: data.pieceType || 'Box',
    description: data.description || '',
    length: parseFloat(data.length || '0'),
    width: parseFloat(data.width || '0'),
    height: parseFloat(data.height || '0'),
    weight: parseFloat(data.weight || '0')
  }];

  return {
    ...data,
    typeOfShipment: data.shipmentType, // Map difference
    productQuantity: parseInt(data.productQuantity || '0'),
    totalFreight: parseFloat(data.totalFreight || '0'),
    // weight is in packages usually or total weight.
    // If admin form has 'weight', assume it's total weight or package weight?
    // Admin form has 'weight' in package details section.
    // We'll map it to shipment.weight (total) or package weight.
    weight: parseFloat(data.weight || '0'),
    packages
  };
};

// Helper to map Shipment to TrackingDetails (for retrieval)
const mapShipmentToTracking = (shipment: Shipment): TrackingDetails => {
  const mainPackage = shipment.packages[0] || {};
  return {
    id: shipment.id,
    trackingNumber: shipment.trackingNumber,
    shipperName: shipment.shipperName,
    shipperAddress: shipment.shipperAddress,
    shipperPhone: shipment.shipperPhone,
    shipperEmail: shipment.shipperEmail,
    receiverName: shipment.receiverName,
    receiverAddress: shipment.receiverAddress,
    receiverPhone: shipment.receiverPhone,
    receiverEmail: shipment.receiverEmail,
    origin: shipment.origin,
    destination: shipment.destination,
    carrier: shipment.carrier,
    shipmentType: shipment.typeOfShipment,
    shipmentMode: shipment.shipmentMode,
    product: shipment.product,
    productQuantity: shipment.productQuantity.toString(),
    paymentMode: shipment.paymentMode,
    totalFreight: shipment.totalFreight.toString(),
    expectedDeliveryDate: shipment.expectedDeliveryDate,
    departureTime: shipment.departureTime,
    pickupDate: shipment.pickupDate,
    pickupTime: shipment.pickupTime,
    // Map first package details to flat structure
    quantity: (mainPackage.quantity || 0).toString(),
    pieceType: mainPackage.pieceType || '',
    description: mainPackage.description || '',
    length: (mainPackage.length || 0).toString(),
    width: (mainPackage.width || 0).toString(),
    height: (mainPackage.height || 0).toString(),
    weight: (mainPackage.weight || 0).toString(),
    comments: shipment.comments || '',
    status: shipment.status,
    currentLocation: shipment.currentLocation,
    lastUpdated: shipment.updatedAt
  };
};

export const createTracking = async (data: any): Promise<{ id: string; trackingNumber: string }> => {
  const shipmentData = mapTrackingToShipment(data);
  const result = await createShipment(shipmentData);
  return { id: result.id, trackingNumber: result.trackingNumber };
};

export const getTrackingByNumber = async (trackingNumber: string): Promise<TrackingDetails | null> => {
  const result = await getShipmentByTracking(trackingNumber);
  return result ? mapShipmentToTracking(result) : null;
};

export const getAllTrackings = async (): Promise<TrackingDetails[]> => {
  const results = await getAllShipments();
  return results.map(mapShipmentToTracking);
};

export const updateTracking = async (id: string, data: any): Promise<void> => {
  // This is tricky because updateTrackingData might be partial.
  // We'll just pass it through mapTrackingToShipment but need to handle partials?
  // For simplicity, we assume mapTrackingToShipment handles it or we manually map.
  // Actually, updateShipment takes Partial<Shipment>.
  const shipmentData = mapTrackingToShipment(data);
  await updateShipment(id, shipmentData);
};

export const deleteTracking = async (id: string): Promise<void> => {
  await deleteShipment(id);
}; 