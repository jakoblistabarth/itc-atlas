import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { geoPath, GeoSphere } from "d3-geo";
import * as topojson from "topojson-client";

const BaseLayer: FC<{ data: any; projection: any }> = ({
  data,
  projection,
}) => {
  const path = geoPath(projection);
  const sphere: GeoSphere = { type: "Sphere" }; // Question: okay to do so?
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const baseLayerGroup = d3.select(ref.current);

    // Oceans
    baseLayerGroup
      .append("g")
      .append("path")
      .attr("id", "oceans")
      .datum(sphere)
      .attr("d", path)
      .style("fill", "#E3E3E3");

    // Graticule
    baseLayerGroup
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
    baseLayerGroup
      .append("path")
      .attr("id", "countries")
      .datum(topojson.feature(data, data.objects.countries))
      .attr("fill", "white")
      .style("fill-opacity", 0.9)
      .attr("d", path);

    // Borders
    baseLayerGroup
      .append("g")
      .attr("id", "borders")
      .append("path")
      .datum(topojson.feature(data, data.objects.countries))
      .attr("fill", "none")
      .attr("stroke", "lightgrey")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 0.3)
      .attr("d", path);
  }, []);

  return <g id="base-map" ref={ref} />;
};

export default BaseLayer;
