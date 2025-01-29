import countries from "world-countries";

const districtData: Record<string, string[]> = {
  USA: ["New York", "California", "Texas", "Florida"],
  Canada: ["Ontario", "Quebec", "British Columbia", "Alberta"],
  Nigeria: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
  UK: ["London", "Manchester", "Birmingham", "Glasgow"],
};

const countriesFormatted = countries.map((item) => ({
  value: item.cca2,
  label: item.name.common,
  latlng: item.latlng,
  region: item.region,
  districts: districtData[item.cca2] || [], // Attach districts if available
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

  return {
    getAllCountries,
    getCountryByValue,
    getDistrictsByCountry,
  };
};
