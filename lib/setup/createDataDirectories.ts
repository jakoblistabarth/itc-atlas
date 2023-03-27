import { existsSync, mkdirSync } from "fs";

export const createDataDirectories = () => {
  const dirPath = "./data/topographic/";
  if (!existsSync(dirPath)) mkdirSync(dirPath);
};
