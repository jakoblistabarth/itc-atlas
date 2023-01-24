import fs from "fs";

type StatusRaw = {
  id: string;
  label: string;
};

export default function loadStatus(): StatusRaw[] {
  const filePath = "./data/static/status.json";
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data as StatusRaw[];
}
