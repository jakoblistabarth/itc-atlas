import * as d3 from "d3";
import { geoPath } from "d3-geo";
import * as topojson from "topojson-client";

export default function createBaseMap(map, baseMapData, projection) {
  const path = geoPath(projection);
  const sphere = { type: "Sphere" };

  const baseMap = map.append("g").attr("id", "base-map");

  // Oceans
  baseMap
    .append("g")
    .append("path")
    .attr("id", "oceans")
    .datum(sphere)
    .attr("d", path)
    .style("fill", "#E3E3E3");

  // Graticule
  baseMap
    .append("g")
    .append("path")
    .datum(d3.geoGraticule10())
    .attr("class", "graticule")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", "grey")
    .style("stroke-width", 0.5)
    .style("stroke-opacity", 0.25);

  // Countries
  baseMap
    .append("path")
    .attr("id", "countries")
    .datum(topojson.feature(baseMapData, baseMapData.objects.countries))
    .attr("fill", "white")
    .style("fill-opacity", 0.9)
    .attr("d", path);

  // Borders
  baseMap
    .append("g")
    .attr("id", "borders")
    .append("path")
    .datum(
      topojson.feature(
        baseMapData,
        baseMapData.objects.countries,
        (a, b) => a !== b
      )
    )
    .attr("fill", "none")
    .attr("stroke", "lightgrey")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 0.3)
    .attr("d", path);
}
