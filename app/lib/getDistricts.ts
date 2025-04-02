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
  ],
  US: [ // United States
    { name: "New York", lat: 40.7128, lng: -74.0060, radius: 30 },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437, radius: 30 },
    { name: "Chicago", lat: 41.8781, lng: -87.6298, radius: 25 },
  ],
  GB: [ // UK
    { name: "London", lat: 51.5074, lng: -0.1278, radius: 25 },
    { name: "Manchester", lat: 53.4808, lng: -2.2426, radius: 20 },
    { name: "Birmingham", lat: 52.4862, lng: -1.8904, radius: 20 },
  ],
  NG: [ // Nigeria
    { name: "Lagos", lat: 6.5244, lng: 3.3792, radius: 25 },
    { name: "Abuja", lat: 9.0765, lng: 7.3986, radius: 20 },
    { name: "Kano", lat: 12.0022, lng: 8.5920, radius: 20 },
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

const countriesFormatted = countries.map((item) => ({
  value: item.cca2,
  label: item.name.common,
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

  return {
    getAllCountries,
    getCountryByValue,
    getDistrictsByCountry,
    getDistrictByCoordinates,
  };
};
