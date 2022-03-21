import * as csv from "csvtojson";

export default async function getAirports() {
  const csvFilePath = "./data/airports.csv";
  const airports = await csv().fromFile(csvFilePath);

  const features = airports.map((d) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [d.long, d.lat],
      },
      properties: d,
    };
  });

  const geoJSON = {
    type: "FeatureCollection",
    features: features,
  };

  return {
    json: airports,
    geoJSON: geoJSON,
  };
}
