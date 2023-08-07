import { readFileSync } from "fs";

type ITCName = {
  year: number;
  name: string;
};

const getITCNames = () => {
  const filePath = "./data/static/itc-names.json";
  const rawdata = readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data.itcNames as ITCName[];
};

export default getITCNames;
