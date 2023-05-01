import { writeFileSync } from "fs";
import { geoBounds, geoGraticule, geoNaturalEarth1, geoPath } from "d3-geo";
//@ts-ignore-error TODO: add types?
import { SyncTileSet } from "srtm-elevation";
import { extent } from "d3";
import { FeatureCollection, Point } from "geojson";

// Rough bounding box around Paramaribo
const loadHgt = async (locations: [number, number][], name: string) => {
  const proj = geoNaturalEarth1();

  const [minLat, maxLat] = extent(locations, (d) => d[0]);
  const [minLng, maxLng] = extent(locations, (d) => d[1]);

  const locationsFeatureCollection: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: locations.map((d) => ({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [d[1], d[0]],
      },
    })),
  };

  const areaGeoBounds = geoBounds(locationsFeatureCollection);
  const [[w, s], [e, n]] = areaGeoBounds;
  const areaBounds = geoPath(proj).bounds(locationsFeatureCollection);
  const areaRectangle = geoGraticule()
    .extentMajor([
      [w, s],
      [e, n],
    ])
    .outline();
  const area = geoPath(proj).area(areaRectangle);

  console.log({ w, s, e, n, areaGeoBounds, areaBounds, area });

  const bBox = [minLat, minLng, maxLat, maxLng];
  if (!minLat || !maxLat || !minLng || !maxLng)
    throw new Error("invalid locations");

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
