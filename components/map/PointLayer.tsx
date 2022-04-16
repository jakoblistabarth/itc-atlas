import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { ScaleLinear, ScalePower } from "d3";
import { FeatureCollection, Point } from "geojson";
import { SymbolAppearance } from "../../types/SymbolAppearance";
import PointSymbol from "./PointSymbol";
import ScaledPie from "./scaledPie";

export enum SymbolType {
  Point = "Point",
  ScaledCircle = "scaledCircle",
  ScaledPie = "scaledPie",
}

const PointLayer: FC<{
  data: FeatureCollection<Point>;
  projection: any;
  style?: SymbolAppearance;
  radius?: number;
  scale?: ScaleLinear<number, number> | ScalePower<number, number>;
  value?: string;
  symbolType?: SymbolType;
}> = ({
  data,
  projection,
  radius = 2,
  style,
  scale,
  value,
  symbolType = SymbolType.Point,
}) => {
  const ref = useRef<SVGGElement>(null);
  const fontSize = 10;

  function renderSymbol(symbolType: SymbolType) {
    switch (symbolType) {
      case SymbolType.Point:
        return (
          <PointSymbol
            projection={projection}
            radius={radius}
            style={style}
            data={data}
          />
        );
      case SymbolType.ScaledPie:
        return (
          <ScaledPie
            projection={projection}
            scale={scale}
            style={style}
            data={data}
          />
        );
    }
  }

  const sorted = data.features.sort((a, b) => {
    if (!value) return 0;
    return d3.descending(a.properties?.[value], b.properties?.[value]);
  });

  useEffect(() => {
    const svgEl = d3.select(ref.current);

    const symbols = svgEl.append("g").attr("id", "symbols");
    const symbol = symbols.selectAll("circle").data(sorted);

    symbol
      .enter()
      .append("circle")
      .attr("cx", (d) => projection(d.geometry.coordinates)[0])
      .attr("cy", (d) => projection(d.geometry.coordinates)[1])
      .attr("r", (d) =>
        scale && value ? scale(d.properties?.[value]) : radius
      )
      .attr("fill", style?.fill?.color ?? "black")
      .attr("fill-opacity", style?.fill?.opacity ?? 0.2)
      .attr("stroke", style?.stroke?.color ?? style?.fill?.color ?? "black")
      .attr("stroke-opacity", style?.stroke?.opacity ?? 0.8)
      .attr("stroke-width", style?.stroke?.width ?? 1)
      .attr("stroke-linejoin", style?.stroke?.linejoin ?? "round");

    //   const labels = symbols.selectAll("text").data(sorted.slice(0, 5));
    //   labels
    //     .enter()
    //     .append("text")
    //     .text((d) => `${d.properties?.["iata_code"]} (${d.properties?.value})`)
    //     .attr("font-size", fontSize)
    //     .attr("font-weight", "bold")
    //     .attr("x", (d) => projection(d.geometry.coordinates)[0] + 5)
    //     .attr("y", (d) => projection(d.geometry.coordinates)[1] + fontSize / 4)
    //     .attr("stroke", "#E3E3E3")
    //     .attr("stroke-width", 2)
    //     .attr("paint-order", "stroke")
    //     .attr("stroke-linejoin", "round")
    //     .attr("fill", style?.text?.color ?? style?.fill?.color ?? "black");
  });

  return (
    <g id="point-Layer" ref={ref}>
      {renderSymbol(symbolType)}
    </g>
  );
};

export default PointLayer;
