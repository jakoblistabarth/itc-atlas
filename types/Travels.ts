export type Flight = {
  airportCodes: string[];
};

export type AirportProperties = {
  ident: string;
  type: string;
  name: string;
  elevation_ft: number;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  gps_code: string;
  iata_code: string;
  local_code: string;
  long: number;
  lat: number;
};
