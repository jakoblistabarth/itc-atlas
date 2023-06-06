import { writeFileSync } from "fs";
import { geoBounds, geoGraticule, geoNaturalEarth1, geoPath } from "d3-geo";
import { geoMollweide } from "d3-geo-projection";
//@ts-ignore-error TODO: add types?
import { SyncTileSet } from "srtm-elevation";
import { extent } from "d3";
import { FeatureCollection, Point } from "geojson";
import proj4 from "proj4";
// Rough bounding box around Paramaribo
const loadHgt = async (locations: [number, number][], name: string) => {
  const proj = geoNaturalEarth1();
  const [minLat1, maxLat1] = extent(locations, (d) => d[0]);
  const [minLng1, maxLng1] = extent(locations, (d) => d[1]);
  const moll =
    "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs";
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
  const [minLng, minLat] = proj4(moll).forward([minLng1 ?? 0, minLat1 ?? 0]);
  const [maxLng, maxLat] = proj4(moll).forward([maxLng1 ?? 0, maxLat1 ?? 0]);
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
        return [lng, lat];
      });
    })
    .flat()
    .map((d) => d.map((c) => c.toFixed(6)));
  const [minLng2, minLat2] = proj4(moll).inverse([minLng, minLat]);
  const [maxLng2, maxLat2] = proj4(moll).inverse([maxLng, maxLat]);
  const tileset = new SyncTileSet(
    "./data/",
    [minLat2, minLng2],
    [maxLat2, maxLng2],
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
