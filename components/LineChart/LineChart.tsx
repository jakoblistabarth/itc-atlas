import { ScaleOrdinal, extent, format, max, scaleLinear } from "d3";
import { FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { MdArrowUpward } from "react-icons/md";
import useMeasure from "react-use-measure";
import AxisX from "../AxisX";
import AxisY from "../AxisY";
import { getFilledSeries } from "../LinePath/LinePath.helpers";
import { LinePathDatum } from "../LinePath/LinePathBase";
import LinePath from "../LinePath/LinePathSimple";
import RuleY from "../RuleY";
import Tooltip from "../Tooltip";

export type LineChartData = {
  id: string;
  label: string;
  colorKey?: string;
  data: LinePathDatum[];
}[];

type Props = {
  data: LineChartData;
  xLabel?: string;
  yLabel?: string;
  yDomain?: [number, number];
  xDomain?: [number, number];
  xTickCount?: number;
  yTickCount?: number;
  colorScale: ScaleOrdinal<string, string>;
  activeRecordId?: string;
  mouseEnterLeaveHandler: (activeRecordId?: string) => void;
};

const LineChart: FC<Props> = ({
  data,
  xLabel,
  yLabel,
  xDomain,
  xTickCount,
  yDomain,
  yTickCount,
  colorScale,
  activeRecordId,
  mouseEnterLeaveHandler,
}) => {
  const [chartRef, { width, height, x: svgX }] = useMeasure();

  const [cursorX, setCursorX] = useState<number | undefined>(undefined);

  const x = cursorX && Math.round(cursorX - svgX);

  const onMouseMove = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      setCursorX(event.pageX);
    },
    [setCursorX],
  );

  const onMouseLeave = useCallback(() => {
    mouseEnterLeaveHandler(undefined);
    setCursorX(undefined);
  }, [mouseEnterLeaveHandler]);
  const onMouseEnter = useCallback(
    () => mouseEnterLeaveHandler(activeRecordId),
    [mouseEnterLeaveHandler, activeRecordId],
  );

  const margin = useMemo(
    () => ({
      top: 30,
      right: 20,
      bottom: 20,
      left: 30,
    }),
    [],
  );

  const { dataFilled, xScale, yScale, xScaleReverse } = useMemo(() => {
    const [minX, maxX] = extent(
      data.map(({ data }) => data.map((d) => d.x)).flat(),
    );
    const maxY = max(data.map(({ data }) => data.map((d) => d.y)).flat());
    const xScale = scaleLinear()
      .domain([xDomain?.[0] ?? minX ?? 0, xDomain?.[1] ?? maxX ?? 1])
      .range([margin.left, width - margin.right])
      .nice(xTickCount)
      .clamp(true);
    const yScale = scaleLinear()
      .domain([yDomain?.[0] ?? 0, yDomain?.[1] ?? maxY ?? 1])
      .range([height - margin.bottom, margin.top])
      .nice(yTickCount);
    const [minTime, maxTime] = xScale.domain();
    const dataFilled = data.map((d) => ({
      ...d,
      data: getFilledSeries<LinePathDatum>(
        d.data,
        (d) => d.x,
        (d) => d.y,
        minTime,
        maxTime,
      ),
    }));
    const xScaleReverse = (x: number) => Math.round(xScale.invert(x));
    return { dataFilled, xScale, yScale, xScaleReverse };
  }, [data, margin, height, width, xDomain, xTickCount, yDomain, yTickCount]);

  return (
    <Tooltip.Root followCursor placement="top-start" offset={10}>
      <Tooltip.Trigger asChild>
        <svg
          ref={chartRef}
          width={"100%"}
          height={"100%"}
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <g>
            <MdArrowUpward size={"10"} />
            <text x={"1.5em"} fontSize={10} dominantBaseline={"hanging"}>
              {yLabel}
            </text>
          </g>

          <RuleY xScale={xScale} yScale={yScale} />
          <AxisX
            top={height - margin.bottom + 5}
            tickFormat={format("4")}
            xScale={xScale}
            tickCount={xTickCount}
          />
          <AxisY left={margin.left} yScale={yScale} tickCount={yTickCount} />
          <g>
            {dataFilled.map((d) => {
              return (
                <LinePath
                  key={d.id}
                  mouseEnterLeaveHandler={mouseEnterLeaveHandler}
                  xScale={xScale}
                  yScale={yScale}
                  yLabel={"travels"}
                  isSelection={!!activeRecordId}
                  isSelected={activeRecordId === d.id}
                  isFocus={true}
                  data={d.data}
                  color={colorScale(d.colorKey ?? d.id)}
                  identifier={d.id}
                  label={d.label}
                />
              );
            })}
          </g>
          {cursorX && (
            <g>
              <line
                stroke="grey"
                strokeWidth={0.5}
                x1={xScale(xScaleReverse(x ?? 0))}
                x2={xScale(xScaleReverse(x ?? 0))}
                y1={yScale.range()[0]}
                y2={yScale.range()[1]}
                pointerEvents={"none"}
              />
              {data.map((record) => {
                const y =
                  record.data.find((d) => d.x === xScaleReverse(x ?? 0))?.y ??
                  0;
                return (
                  <circle
                    key={record.id}
                    cx={xScale(xScaleReverse(x ?? 0))}
                    cy={yScale(y)}
                    fill={colorScale(record.colorKey ?? record.id)}
                    strokeWidth={2}
                    pointerEvents={"none"}
                    className="stroke-white drop-shadow-md dark:stroke-itc-green-950"
                    r={5}
                  />
                );
              })}
            </g>
          )}
        </svg>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {yLabel && <span>{yLabel} in</span>} {xLabel && <>{xLabel} </>}
        <span className="font-bold">{xScaleReverse(x ?? 0)}</span>
        {data.map(({ label, colorKey, id, data }) => {
          const value = data.find((d) => d.x === xScaleReverse(x ?? 0))?.y ?? 0;
          return (
            <div className="flex items-center gap-2 text-xs" key={id}>
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: colorScale(colorKey ?? id) }}
              ></div>
              <div>{label}</div>
              <div className="font-bold">{value}</div>{" "}
            </div>
          );
        })}
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

export default LineChart;
