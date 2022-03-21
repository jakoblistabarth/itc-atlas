export default async function getCountries(scale: string) {
  const url = `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-${scale}.json`;
  const json = await fetch(url).then((res) => res.json());
  return json;
}
