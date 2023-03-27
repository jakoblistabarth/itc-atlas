import { writeFileSync } from "fs";
//@ts-ignore-error TODO: add types?
import { SyncTileSet } from "srtm-elevation";

// Rough bounding box around Paramaribo
const loadHgt = async (locations: [number, number][], name: string) => {
  const lats = locations.map((l) => l[0]);
  const lngs = locations.map((l) => l[1]);
  const minLat = Math.min.apply(null, lats);
  const maxLat = Math.max.apply(null, lats);
  const minLng = Math.min.apply(null, lngs);
  const maxLng = Math.max.apply(null, lngs);

  const segments = 1000;
  const gridSize = segments + 1;

  const stepLat = Math.abs(maxLat - minLat) / gridSize;
  const stepLng = Math.abs(maxLng - minLng) / gridSize;

  const pois = Array.from({ length: gridSize })
    .map((_, rowIdx) => {
      const lat = minLat + rowIdx * stepLat;
      return Array.from({ length: gridSize }).map((_, colIdx) => {
        const lng = minLng + colIdx * stepLng;
        return [lat, lng];
      });
    })
    .flat()
    .map((d) => d.map((c) => c.toFixed(6)));

  const bBox = [minLat, minLng, maxLat, maxLng];

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
        const elevation = tileset.getElevation([l[0], l[1]]);
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
