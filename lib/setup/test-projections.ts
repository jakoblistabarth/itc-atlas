import proj4 from "proj4";
import { geoMollweide } from "d3-geo-projection";

const gnom =
  "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
const natEearth =
  "+proj=natearth +lon_0=0 +x_0=0 +y_0=0 +R=6371008.7714 +units=m +no_defs +type=crs";
const natEarth2 =
  "+proj=natearth2 +lon_0=0 +x_0=0 +y_0=0 +R=6371008.7714 +units=m +no_defs +type=crs";
const eqEarth =
  "+proj=eqearth +lon_0=0 +x_0=0 +y_0=0 +R=6371008.7714 +units=m +no_defs +type=crs";
const cea =
  "+proj=cea +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +R=6371000 +units=m +no_defs +type=crs";
const moll =
  "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs";

const latlng = [0.001, -0.001];
const coordProj4 = proj4(moll, latlng);
const coordD3geo = geoMollweide()(latlng);
const coordD3geoFit = geoMollweide().fitSize([10, 10], { type: "Sphere" })(
  latlng
);
console.log({ coordProj4, coordD3geo, coordD3geoFit });
