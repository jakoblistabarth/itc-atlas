import puppeteer from "puppeteer";

const getBrowser = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  return browser;
};

export default getBrowser;
