import { writeFileSync } from "fs";
//@ts-ignore-error TODO: add types?
import { SyncTileSet } from "srtm-elevation";
import { extent } from "d3";
import proj4 from "proj4";

// Rough bounding box around Paramaribo
const loadHgt = async (locations: [number, number][], name: string) => {
  const [minLat, maxLat] = extent(locations, (d) => d[0]);
  const [minLng, maxLng] = extent(locations, (d) => d[1]);
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
  const bBox = [south, west, north, east];
  if (!south || !west || !north || !east) throw new Error("invalid locations");
  const segments = 1000;
  const gridSize = segments + 1;
  const stepY = Math.abs(north - south) / gridSize;
  const stepX = Math.abs(east - west) / gridSize;
  const pois = Array.from({ length: gridSize })
    .map((_, rowIdx) => {
      const y = south + rowIdx * stepY;
      return Array.from({ length: gridSize }).map((_, colIdx) => {
        const x = west + colIdx * stepX;
        return [x, y];
      });
    })
    .flat()
    .map((d) => d.map((c) => c.toFixed(6)));
  const tileset = new SyncTileSet(
    "./data/",
    [minLat, minLng],
    [maxLat, maxLng],
    function (err: string) {
      if (err) {
        console.log(err);
        return;
      }
      const elevation = pois.map((l) => {
        const [x, y] = proj4(moll).inverse([+l[0] ?? 0, +l[1] ?? 0]);
        const elevation = tileset.getElevation([y + "", x + ""]);
        return +elevation.toFixed(1);
      });

      const fileContent = {
        elevation,
        bBox,
        name,
      };

      writeFileSync(
        `data/topographic/elevation-${name}.json`,
        JSON.stringify(fileContent)
      );
    },
    {
      provider: "https://bailu.ch/dem3/{lat}/{lat}{lng}.hgt.zip",
    }
  );
};
export default loadHgt;
