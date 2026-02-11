export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodingResult {
  coordinates: Coordinates;
  formattedAddress: string;
}

const geocodingCache = new Map<string, GeocodingResult>();

const fallbackCoordinates = {
  us: { lat: 39.8283, lng: -98.5795 },
  europe: { lat: 54.5260, lng: 15.2551 },
  asia: { lat: 34.0479, lng: 100.6197 },
  default: { lat: 39.8283, lng: -98.5795 }
};

/**
 * Resolves a query string (Address name or "Lat, Lon") into a unified object.
 * Returns: { coordinates: { lat, lng }, formattedAddress }
 */
export const geocodeAddress = async (query: string): Promise<GeocodingResult> => {
  if (geocodingCache.has(query)) {
    return geocodingCache.get(query)!;
  }

  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return {
      coordinates: fallbackCoordinates.default,
      formattedAddress: 'Unknown Location'
    };
  }

  // 1. Detect if input is raw coordinates (e.g. "48.85, 2.35" or "48.85,2.35")
  const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
  const match = cleanQuery.match(coordRegex);

  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[3]);

    try {
      // Using Photon API (OpenStreetMap based, CORS friendly)
      const url = `https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`;
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
        ].filter((item: any) => item && item !== "");

        const uniqueParts = addressParts.filter((item: any, index: number) => addressParts.indexOf(item) === index);

        const result: GeocodingResult = {
          coordinates: { lat, lng },
          formattedAddress: uniqueParts.join(", ") || `Coordinates: ${lat}, ${lng}`
        };
        geocodingCache.set(query, result);
        return result;
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return {
        coordinates: { lat, lng },
        formattedAddress: `Coordinates: ${lat}, ${lng}`
      };
    }
  }

  // 2. Input is Address -> Forward Geocode
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}`;
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

      const result: GeocodingResult = {
        coordinates: { lat: coords[1], lng: coords[0] },
        formattedAddress: addressParts.join(", ") || cleanQuery
      };
      geocodingCache.set(query, result);
      return result;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  // Fallback if geocoding fails
  const fallbackResult: GeocodingResult = {
    coordinates: fallbackCoordinates.default,
    formattedAddress: cleanQuery
  };
  geocodingCache.set(query, fallbackResult);
  return fallbackResult;
};

export const geocodeMultipleAddresses = async (addresses: string[]): Promise<GeocodingResult[]> => {
  return Promise.all(addresses.map(address => geocodeAddress(address)));
};
