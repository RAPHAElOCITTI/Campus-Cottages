import countries from "world-countries";

// Sample district data with coordinates
// In a real application, you would use a more comprehensive database
// or call an external API like OpenStreetMap Nominatim
const districtData: Record<string, Array<{name: string, lat: number, lng: number, radius?: number}>> = {
  UG: [ // Uganda
    { name: "Kampala", lat: 0.3476, lng: 32.5825, radius: 15 },
    { name: "Mbarara", lat: -0.6167, lng: 30.6500, radius: 10 },
    { name: "Jinja", lat: 0.4250, lng: 33.2036, radius: 10 },
    { name: "Gulu", lat: 2.7747, lng: 32.2997, radius: 10 },
    { name: "Mbale", lat: 1.0667, lng: 34.1833, radius: 10 },
    // Add more districts
    { name: "Entebbe", lat: 0.0512, lng: 32.4637, radius: 10 },
    { name: "Fort Portal", lat: 0.6710, lng: 30.2747, radius: 10 },
    { name: "Masaka", lat: -0.3333, lng: 31.7333, radius: 10 },
    { name: "Arua", lat: 3.0167, lng: 30.9000, radius: 10 },
    { name: "Lira", lat: 2.2499, lng: 32.8999, radius: 10 },
  ],
  US: [ // United States
    { name: "New York", lat: 40.7128, lng: -74.0060, radius: 30 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437, radius: 30 },
    { name: "Chicago", lat: 41.8781, lng: -87.6298, radius: 25 },
    { name: "Boston", lat: 42.3601, lng: -71.0589, radius: 20 },
    { name: "San Francisco", lat: 37.7749, lng: -122.4194, radius: 20 },
    { name: "Seattle", lat: 47.6062, lng: -122.3321, radius: 20 },
    { name: "Miami", lat: 25.7617, lng: -80.1918, radius: 20 },
  ],
  GB: [ // UK
    { name: "London", lat: 51.5074, lng: -0.1278, radius: 25 },
    { name: "Manchester", lat: 53.4808, lng: -2.2426, radius: 20 },
    { name: "Birmingham", lat: 52.4862, lng: -1.8904, radius: 20 },
    { name: "Edinburgh", lat: 55.9533, lng: -3.1883, radius: 20 },
    { name: "Glasgow", lat: 55.8642, lng: -4.2518, radius: 20 },
    { name: "Leeds", lat: 53.8008, lng: -1.5491, radius: 20 },
  ],
  NG: [ // Nigeria
    { name: "Lagos", lat: 6.5244, lng: 3.3792, radius: 25 },
    { name: "Abuja", lat: 9.0765, lng: 7.3986, radius: 20 },
    { name: "Kano", lat: 12.0022, lng: 8.5920, radius: 20 },
    { name: "Ibadan", lat: 7.3964, lng: 3.9167, radius: 20 },
    { name: "Port Harcourt", lat: 4.8156, lng: 7.0498, radius: 20 },
    { name: "Benin City", lat: 6.3350, lng: 5.6278, radius: 20 },
  ],
  KE: [ // Kenya
    { name: "Nairobi", lat: -1.2921, lng: 36.8219, radius: 20 },
    { name: "Mombasa", lat: -4.0435, lng: 39.6682, radius: 20 },
    { name: "Kisumu", lat: -0.1022, lng: 34.7617, radius: 15 },
    { name: "Nakuru", lat: -0.3031, lng: 36.0800, radius: 15 },
  ],
  TZ: [ // Tanzania
    { name: "Dar es Salaam", lat: -6.7924, lng: 39.2083, radius: 20 },
    { name: "Mwanza", lat: -2.5167, lng: 32.9000, radius: 15 },
    { name: "Arusha", lat: -3.3667, lng: 36.6833, radius: 15 },
    { name: "Dodoma", lat: -6.1731, lng: 35.7419, radius: 15 },
  ],
};

// Helper function to calculate distance between two coordinates (in km)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Function to generate a more descriptive location name when we don't have an exact match
function generateApproximateLocationName(lat: number, lng: number, countryCode: string): string | null {
  // Find country details first
  const country = countriesFormatted.find(c => c.value === countryCode);
  if (!country) return null;
  
  // If we have districts for this country, find the closest one and generate an approximate name
  if (districtData[countryCode] && districtData[countryCode].length > 0) {
    let closestDistrict = null;
    let smallestDistance = Number.MAX_VALUE;
    
    for (const district of districtData[countryCode]) {
      const distance = calculateDistance(lat, lng, district.lat, district.lng);
      if (distance < smallestDistance) {
        closestDistrict = district;
        smallestDistance = distance;
      }
    }
    
    if (closestDistrict) {
      // If it's within 5km, it's "in" the district
      if (smallestDistance < 5) {
        return `${closestDistrict.name}, ${country.label}`;
      }
      // If it's within 20km, it's "near" the district
      else if (smallestDistance < 20) {
        return `Near ${closestDistrict.name}, ${country.label}`;
      }
      // If it's within 50km, it's "in the area of" the district
      else if (smallestDistance < 50) {
        return `${closestDistrict.name} Area, ${country.label}`;
      }
    }
  }
  
  // If we can't determine a more specific location, return a generic location with coordinates
  return `Area at (${lat.toFixed(4)}, ${lng.toFixed(4)}), ${country.label}`;
}

const countriesFormatted = countries.map((item) => ({
  value: item.cca2,
  label: item.name.common,
  flag: item.flag,
  latlng: item.latlng,
  region: item.region,
  districts: Object.keys(districtData).includes(item.cca2) 
    ? districtData[item.cca2].map(d => d.name) 
    : [],
}));

export const useDistricts = () => {
  // Get all countries
  const getAllCountries = () => countriesFormatted;

  // Get a specific country by its value (e.g., cca2 code)
  const getCountryByValue = (value: string) => {
    return countriesFormatted.find((item) => item.value === value);
  };

  // Get districts for a specific country
  const getDistrictsByCountry = (value: string): string[] => {
    const country = getCountryByValue(value);
    return country?.districts || []; // Always return an array, even if empty
  };

  // Get district name based on coordinates
  const getDistrictByCoordinates = async (lat: number, lng: number, countryCode?: string): Promise<string | null> => {
    // If country code is provided, only search within that country
    const countriesToSearch = countryCode 
      ? (districtData[countryCode] ? [countryCode] : [])
      : Object.keys(districtData);
    
    let closestDistrict = null;
    let smallestDistance = Number.MAX_VALUE;
    
    // Find the closest district in our data
    for (const country of countriesToSearch) {
      for (const district of districtData[country]) {
        const distance = calculateDistance(lat, lng, district.lat, district.lng);
        const radiusToUse = district.radius || 25; // Default radius of 25km if not specified
        
        if (distance < radiusToUse && distance < smallestDistance) {
          closestDistrict = district.name;
          smallestDistance = distance;
        }
      }
    }
    
    return closestDistrict;
  };

  // Get a user-friendly location name
  const getLocationNameFromCoordinates = async (lat: number, lng: number, countryCode: string): Promise<string> => {
    // First try to get an exact district match
    const district = await getDistrictByCoordinates(lat, lng, countryCode);
    
    if (district) {
      // We found an exact match
      const country = getCountryByValue(countryCode);
      return `${district}, ${country?.label || ''}`;
    } else {
      // If no exact match, generate an approximate location name
      const approximateLocation = generateApproximateLocationName(lat, lng, countryCode);
      return approximateLocation || `Location in ${getCountryByValue(countryCode)?.label || 'Unknown Country'}`;
    }
  };

  return {
    getAllCountries,
    getCountryByValue,
    getDistrictsByCountry,
    getDistrictByCoordinates,
    getLocationNameFromCoordinates,
  };
};
