import axios from "axios";
import fs from "fs";

const loadCities = () => {
  const url =
    "https://data.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000@public/download/?format=csv&timezone=Europe/Berlin&lang=en&use_labels_for_header=true&csv_separator=%3B";

  const getFile = async (url: string) => {
    console.log(`downloading file 🛸 … (${url}) `);
    const body = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const dirPath = "./data/topographic";
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(dirPath + "/cities.csv", body.data);
  };

  getFile(url);
};

export default loadCities;
