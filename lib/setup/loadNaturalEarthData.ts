import os from "os";
import admZip from "adm-zip";
// @ts-ignore
import mapShaper from "mapshaper";
import axios from "axios";
import { NeScales } from "../../types/NeTopoJson";

type fCategory = "physical" | "cultural";

const loadNaturalEarthData = () => {
  const tmpDir = os.tmpdir() + "/";

  const baseUrl =
    "https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/";
  const scales: NeScales[] = ["10m", "110m"]; // available 110m 50m, 10m
  const features: { [K in fCategory]: string[] } = {
    physical: ["rivers_lake_centerlines", "lakes"],
    cultural: ["admin_0_countries", "populated_places"],
  };

  const getName = (url: string): string => {
    return url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
  };

  const getFile = async (url: string, callback: () => void) => {
    console.log(`downloading file 🛸 … (${url}) `);
    const body = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const zip = new admZip(body.data);
    const output = tmpDir + getName(url) + "/";
    zip.extractAllToAsync(output, true, false, function (error) {
      if (error) {
        console.error("Failed to unzip " + getName(url));
        return;
      }

      callback();
    });
  };

  for (const scale of scales) {
    let category: keyof typeof features;
    for (category in features) {
      for (const feature of features[category]) {
        const name = `ne_${scale}_${feature}`;
        const url = `${baseUrl}${scale}/${category}/${name}.zip`;
        const shpPath = `${tmpDir}${name}/${name}.shp`;
        (async () => {
          await getFile(url, () =>
            mapShaper.runCommands(
              `-i ${shpPath} name=ne_${feature} -o format=topojson data/topographic/${name}.json`
            )
          );
        })();
      }
    }
  }
};

export default loadNaturalEarthData;
