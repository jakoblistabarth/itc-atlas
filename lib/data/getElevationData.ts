import fs from "fs";

const getElevationData = async (name: string) => {
  const filePath = `./data/topographic/elevation-${name}.json`;
  const raw = fs.readFileSync(filePath);
  const elevation = JSON.parse(raw.toString());
  return elevation;
};

export default getElevationData;
