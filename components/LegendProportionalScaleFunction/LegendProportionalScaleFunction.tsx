import { FC } from "react";
import { line, bin, range, min, max, scaleLinear, ScalePower } from "d3";

const LegendProportionalScaleFunction: FC<{
  data: number[];
  scaleRadius: ScalePower<number, number>;
}> = ({ data, scaleRadius }) => {
  const minData = min(data);
  const maxData = max(data);

  if (minData == undefined || maxData == undefined) return <></>;

  const diameter = scaleRadius(maxData) * 2;
  const xScale = scaleLinear()
    .domain([0, maxData - minData])
    .clamp(true)
    .range([0, diameter]);

  const curve = range(minData, maxData).map((val, idx) => {
    const y = scaleRadius(val);
    const x = xScale(idx);
    return [x, scaleRadius(maxData) - y] as [number, number];
  });

  const binGenerator = bin().thresholds(10);
  const buckets = binGenerator(data);
  const maxBin = max(buckets, (d) => d.length);
  const yScale = scaleLinear()
    .domain([0, maxBin ?? 1])
    .nice()
    .range([diameter / 2, 0]);

  return (
    <g>
      <g id="histogram-bins">
        {buckets.map((bucket) => (
          <rect
            key={`${bucket.x0}-${bucket.x1}`}
            fill="lightgrey"
            x={xScale(bucket.x0 || 0) + 1}
            y={yScale(bucket.length)}
            width={Math.max(
              0,
              xScale(bucket.x1 || 0) - xScale(bucket.x0 || 0) - 1
            )}
            height={yScale(0) - yScale(bucket.length)}
          />
        ))}
      </g>
      <g id="radius-function">
        <path
          strokeLinecap="round"
          d={line()(curve) || ""}
          fill="none"
          stroke="black"
        />
        <g transform={`translate(${xScale(curve.length)},0)`}>
          <circle r={1} />
          <text dx={6} fontSize={6} dominantBaseline={"middle"}>
            radius
          </text>
        </g>
      </g>
      <g id={"x-axis"}>
        <line
          x1="0"
          x2={xScale(maxData - minData)}
          y1={scaleRadius(maxData)}
          y2={scaleRadius(maxData)}
          strokeWidth={0.5}
          stroke={"black"}
        />
        {[minData, maxData].map((val, idx) => (
          <text
            key={`${val}-${idx}`}
            x={xScale(val)}
            y={scaleRadius(maxData) + 10}
            textAnchor={idx < 1 ? "start" : "end"}
            fontSize={6}
          >
            {val}
          </text>
        ))}
      </g>
    </g>
  );
};

export default LegendProportionalScaleFunction;
