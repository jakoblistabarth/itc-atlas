type TypeMapping = { [key: string]: string };

const mappedCountries: TypeMapping = {
  Bangladesch: "Bangladesh",
  "Cape Verde": "Cabo Verde",
  EMEA: "Europe, Africa, Western Asia",
  Benelux: "Belgium, Netherlands, Luxembourg",
  Kazakstan: "Kazakhstan",
  "Palestinian Territories": "State of Palestine",
  Macedonia: "North Macedonia",
  Overijssel: "Netherlands",
  "The Netherlands": "Netherlands",
  Syria: "Syrian Arab Republic",
  Twente: "Netherlands",
  USA: "United States of America",
  UK: "United Kingdom of Great Britain and Northern Ireland",
  Venezuela: "Venezuela (Bolivarian Republic of)",
  Vietnam: "Viet Nam",
};

export default mappedCountries;

export function mapCountries(countryString: string): string {
  if (!countryString) return "";
  let string = countryString.replace(/[\(\)]/g, ",");
  Object.entries(mappedCountries).forEach(([key, value]) => {
    string = string.replace(key, value);
  });
  return string;
}
