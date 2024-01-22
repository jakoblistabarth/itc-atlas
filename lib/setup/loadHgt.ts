import { writeFileSync } from "fs";
//@ts-expect-error srtm-elevation is not typed
import { SyncTileSet } from "srtm-elevation";
import proj4 from "proj4";
import { BBox } from "geojson";

const loadHgt = async (bBox: BBox, name: string) => {
  console.log(`🛰️ Loading height data for ${name}`);
  const [minLng, minLat, maxLng, maxLat] = bBox;
  const moll =
    "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs";
  const [west, south] = proj4(moll).forward([
    minLng ?? -Infinity,
    minLat ?? Infinity,
  ]);
  const [east, north] = proj4(moll).forward([
    maxLng ?? Infinity,
    maxLat ?? Infinity,
  ]);
  if ([south, west, north, east].some((d) => d === undefined))
    throw new Error(`invalid locations for area ${name}!`);
  const width = Math.abs(east - west);
  const depth = Math.abs(north - south);
  const segments = 250;
  const vertices = segments + 1;
  const stepY = depth / vertices;
  const stepX = width / vertices;
  const pois = Array.from({ length: vertices })
    .map((_, rowIdx) => {
      const y = north - rowIdx * stepY;
      return Array.from({ length: vertices }).map((_, colIdx) => {
        const x = west + colIdx * stepX;
        return [x, y];
      });
    })
    .flat()
    .map((d) => d.map((c) => +c.toFixed(6)));
  const tileset = new SyncTileSet(
    "./data/topographic/elevation",
    [minLat, minLng],
    [maxLat, maxLng],
    function (err: string) {
      if (err) {
        console.log(err);
        return;
      }
      const elevation = pois.map(([x, y]) => {
        const [lng, lat] = proj4(moll).inverse([x, y]);
        const elevation = tileset.getElevation([lat, lng]);
        return +elevation.toFixed(1);
      });

      const fileContent = {
        elevation,
        bBox,
        name,
        dimensions: {
          width,
          depth,
          ratio: width / depth,
        },
      };

      writeFileSync(
        `data/topographic/elevation-${name}.json`,
        JSON.stringify(fileContent),
      );
    },
    {
      provider: "https://bailu.ch/dem3/{lat}/{lat}{lng}.hgt.zip",
    },
  );
};
export default loadHgt;
