export type AirportProperties = {
  name: string;
  countryIsoAlpha2: string;
  iataCode: string;
  longitude: number;
  latitude: number;
  website?: string;
  wikipedia?: string;
};

export type Travel = {
  dateStart: string;
  dateEnd: string;
  department: string;
  mNumber: string;
  country: string;
  type: string;
  destination: string;
};
