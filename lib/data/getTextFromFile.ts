import fs from "fs";

const getTextFromFile = async (filePath: string) => {
  const raw = fs.readFileSync(filePath);
  return raw.toString();
};

export default getTextFromFile;
