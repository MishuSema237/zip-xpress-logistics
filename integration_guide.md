# Leaflet Map & Geocoding Integration Guide

This guide explains how to extract the geocoding and mapping logic from the test page and integrate it into another application (e.g., a React app, a Node.js backend, or another HTML page).

## 1. Dependencies
You need to include **Leaflet.js** in your project.

### HTML/CDN
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

### NPM (React/Vue/Angular)
```bash
npm install leaflet
```
*(Note: You'll simply import `L` from 'leaflet' instead of using the script tag.)*

## 2. Core Logic Extraction
The core value of the test page is the `getCoordinates` function which handles both coordinate parsing and address lookup.

### The Geocoding Function
Copy this function into your utility file or service layer.

```javascript
/**
 * Resolves a query string (Address name or "Lat, Lon") into a unified object.
 * Returns: { lat, lon, name } or null
 */
async function getCoordinates(query) {
    if (!query) return null;

    // 1. Detect if input is raw coordinates (e.g. "48.85, 2.35")
    const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    const match = query.match(coordRegex);
    
    // CASE A: Input is Coordinates -> Reverse Geocode
    if (match) {
        const lat = parseFloat(match[1]);
        const lon = parseFloat(match[3]);
        
        try {
            // Using Photon API (OpenStreetMap based, CORS friendly)
            const url = `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                const props = data.features[0].properties;
                
                // Format Address: "House# Street, City, State, Postcode, Country"
                let addressName = props.name;
                if (props.housenumber && props.street) {
                    addressName = `${props.housenumber} ${props.street}`;
                } else if (props.street) {
                    addressName = props.street;
                }

                const addressParts = [
                    addressName,
                    props.city,
                    props.state,
                    props.postcode, 
                    props.country
                ].filter(item => item && item !== "");
                
                const uniqueParts = [...new Set(addressParts)];
                
                return {
                    lat: lat,
                    lon: lon,
                    name: uniqueParts.join(", ") || `Coordinates: ${lat}, ${lon}`
                };
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            // Fallback if API fails
            return { lat, lon, name: `Coordinates: ${lat}, ${lon}` };
        }
    }

    // CASE B: Input is Address -> Forward Geocode
    try {
        const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const coords = data.features[0].geometry.coordinates; // Photon returns [lon, lat]
            const props = data.features[0].properties;
            
            const addressParts = [
                props.name,
                props.street,
                props.city,
                props.country
            ].filter(Boolean);
                
            return {
                lat: coords[1],
                lon: coords[0],
                name: addressParts.join(", ") || query
            };
        }
    } catch (error) {
        console.error("Geocoding error:", error);
    }
    return null;
}
```

## 3. Integration Examples

### In a React Component
```jsx
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import getCoordinates from './utils/geocoding'; // The function above

const MyMapComponent = () => {
  const [location, setLocation] = useState(null);

  const handleSearch = async () => {
    const result = await getCoordinates("46.8, -71.2"); // or "Paris"
    if (result) {
      setLocation(result);
      console.log("Found:", result.name);
    }
  };

  return (
    <div>
      <button onClick={handleSearch}>Find Location</button>
      {location && (
        <MapContainer center={[location.lat, location.lon]} zoom={13} style={{height: '400px'}}>
             <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
             <Marker position={[location.lat, location.lon]}>
                <Popup>{location.name}</Popup>
             </Marker>
        </MapContainer>
      )}
    </div>
  );
};
```

### In a Backend (Node.js)
If you run this server-side, `fetch` acts the same (in Node 18+). You can use this to clean up user data before saving to a database.

```javascript
/* controller.js */
async function saveTrip(req, res) {
    const { startInput, endInput } = req.body;
    
    // Resolve ambiguous inputs to concrete coordinates + formatted addresses
    const startLoc = await getCoordinates(startInput);
    const endLoc = await getCoordinates(endInput);
    
    if(!startLoc || !endLoc) return res.status(400).send("Invalid locations");

    // Save to DB: startLoc.lat, startLoc.lon, startLoc.name
    await db.trips.create({ start: startLoc, end: endLoc });
    
    res.json({ success: true, start: startLoc, end: endLoc });
}
```

## 4. API Limits
*   **Photon/Komoot**: Free for reasonable usage. If you plan to make thousands of requests per day, you should host your own Photon instance (it's open source) or check their usage policy.
