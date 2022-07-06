import os from "os";
import admZip from "adm-zip";
// @ts-ignore
import mapShaper from "mapshaper";
import axios from "axios";

const getNaturalEarthData = () => {
  const tmpDir = os.tmpdir() + "/";

  const baseUrl =
    "https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/";
  const scales = [10, 110]; // available 110m 50m, 10m
  const features = ["rivers_lake_centerlines", "lakes"];

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
    for (const feature of features) {
      const name = "ne_" + scale + "m_" + feature;
      const url = baseUrl + scale + "m/physical/" + name + ".zip";
      const shpPath = tmpDir + name + "/" + name + ".shp";
      (async () => {
        await getFile(url, () =>
          mapShaper.runCommands(
            `-i ${shpPath} name=ne_${feature} -o format=topojson data/topographic/${name}.json`
          )
        );
      })();
    }
  }
};

export default getNaturalEarthData;
