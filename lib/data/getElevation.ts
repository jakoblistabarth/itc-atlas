//@ts-expect-error srtm-elevation is not typed
import { TileSet } from "srtm-elevation";

const getElevation = async (longitude: number, latitude: number) => {
  const tileSet = new TileSet("./data/topographic/elevation", {
    provider: "https://bailu.ch/dem3/{lat}/{lat}{lng}.hgt.zip",
  });

  const getElevationAsync = () =>
    new Promise<number | string>((resolve) => {
      tileSet.getElevation(
        [latitude, longitude],
        (err: Error, response: number) => {
          if (err) resolve(err.message);
          else resolve(response);
        }
      );
    });

  return await getElevationAsync();
};

export default getElevation;
