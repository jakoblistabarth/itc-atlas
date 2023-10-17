import { FC } from "react";
import Sparkline from "../Sparkline";
import { max, scaleLinear } from "d3";
import { LinePathDatum } from "../LinePath/LinePathBase";
import useMeasure from "react-use-measure";

type Props = {
  height?: number;
  data: {
    label: string;
    data: LinePathDatum[];
  }[];
};

const SmallMultiplesTimeSeries: FC<Props> = ({ data, height = 50 }) => {
  const [ref, { width }] = useMeasure();

  const maxY = data.reduce((acc, series) => {
    const maxSeries = max(series.data.map((d) => d.y));
    return maxSeries && maxSeries > acc ? maxSeries : acc;
  }, 0);
  const margin = 2;
  const xScale = scaleLinear()
    .domain([1955, 2023])
    .range([margin, width - margin]);
  const yScale = scaleLinear().domain([0, maxY]).range([height, 0]);
  return (
    <div ref={ref} className="grid gap-4">
      {data.map(({ label, data }) => {
        return (
          <div key={label}>
            <h5>{label}</h5>
            <Sparkline
              xScale={xScale}
              yScale={yScale}
              label={label}
              data={data}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SmallMultiplesTimeSeries;
