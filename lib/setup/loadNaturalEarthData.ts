import admZip from "adm-zip";
import fs from "fs";
import os from "os";
// @ts-expect-error mapShaper is not typed
import mapShaper from "mapshaper";
import { NeScales } from "../../types/NeTopoJson";

type fCategory = "physical" | "cultural";

const loadNaturalEarthData = () => {
  const tmpDir = os.tmpdir() + "/";

  const baseUrl =
    "https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/";
  const scales: NeScales[] = ["110m", "50m", "10m"];
  const features: { [K in fCategory]: string[] } = {
    physical: ["rivers_lake_centerlines", "lakes"],
    cultural: ["admin_0_countries", "populated_places"],
  };

  const getName = (url: string): string => {
    return url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
  };

  const getFile = async (url: string, callback: () => void) => {
    const response = await fetch(url);
    console.log(`downloading file 🛸 … (${url}) `);
    const buffer = Buffer.from(await response.arrayBuffer());

    const zip = new admZip(buffer);
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
        const jsonPath = `data/topographic/${name}.json`;
        if (fs.existsSync(jsonPath)) {
          console.log(`📦 File "${name}" already exists, skip download.`);
          continue;
        }
        const url = `${baseUrl}${scale}/${category}/${name}.zip`;
        const shpPath = `${tmpDir}${name}/${name}.shp`;
        (async () => {
          await getFile(url, () =>
            mapShaper.runCommands(
              `-i ${shpPath} name=ne_${feature} -o format=topojson ${jsonPath}`,
            ),
          );
        })();
      }
    }
  }
};

export default loadNaturalEarthData;
