import { readFileSync } from "fs";

type PolicyTopic = {
  name: string;
  dateStart: number;
  dateEnd: number;
};

const getPolicyTopics = () => {
  const filePath = "./data/static/policy-topics.json";
  const rawdata = readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data.policyTopics as PolicyTopic[];
};

export default getPolicyTopics;
