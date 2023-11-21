import { Group } from "@visx/group";
import { ScaleOrdinal, extent, format, max, scaleLinear } from "d3";
import { FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { MdArrowUpward, MdInfoOutline } from "react-icons/md";
import useMeasure from "react-use-measure";
import { twMerge } from "tailwind-merge";
import AxisX from "../AxisX";
import AxisY from "../AxisY";
import { Card } from "../Card";
import { getFilledSeries } from "../LinePath/LinePath.helpers";
import { LinePathDatum } from "../LinePath/LinePathBase";
import LinePath from "../LinePath/LinePathSimple";
import RuleY from "../RuleY";

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
  colorScale: ScaleOrdinal<string, string>;
  activeRecordId?: string;
  mouseEnterLeaveHandler: (activeRecordId?: string) => void;
};

const LineChart: FC<Props> = ({
  data,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  colorScale,
  activeRecordId,
  mouseEnterLeaveHandler,
}) => {
  const [chartRef, { width, height, x: svgX }] = useMeasure();

  const [cursorX, setCursorX] = useState<number | undefined>(undefined);
  const [left, setLeft] = useState<number | undefined>(undefined);
  const [top, setTop] = useState<number | undefined>(undefined);

  const x = cursorX && Math.round(cursorX - svgX);

  const onMouseMove = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      setCursorX(event.pageX);
      setLeft(event.pageX + 15);
      setTop(event.pageY - 15);
    },
    [setLeft, setTop, setCursorX],
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
      left: 50,
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
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([yDomain?.[0] ?? 0, yDomain?.[1] ?? maxY ?? 1])
      .range([height - margin.bottom, margin.top]);
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
  }, [data, margin, height, width, xDomain, yDomain]);

  const hasNoData = useMemo(
    () => activeRecordId && !data.find((d) => d.id === activeRecordId),
    [activeRecordId, data],
  );

  return (
    <>
      <svg
        ref={chartRef}
        width={"100%"}
        height={"100%"}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <g
          opacity={hasNoData ? 0.5 : 1}
          className="transition-opacity duration-500"
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
          />
          <AxisY left={margin.left} yScale={yScale} />
        </g>
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
        {hasNoData && (
          <Group top={height / 2} left={width / 2}>
            <MdInfoOutline y={-40} />
            <text textAnchor="middle">
              No Travel for <tspan fontWeight={"bold"}>{activeRecordId}</tspan>
            </text>
          </Group>
        )}
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
                record.data.find((d) => d.x === xScaleReverse(x ?? 0))?.y ?? 0;
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
      {cursorX && (
        <div className="pointer-events-none absolute" style={{ top, left }}>
          <Card
            className={twMerge(
              x && x > width / 2 && "-left-full -translate-x-full",
            )}
          >
            <Card.Header>
              {yLabel && <span>{yLabel} in</span>} {xLabel && <>{xLabel} </>}
              <span className="font-bold">{xScaleReverse(x ?? 0)}</span>
            </Card.Header>
            <Card.Body>
              {data.map(({ label, colorKey, id, data }) => {
                const value =
                  data.find((d) => d.x === xScaleReverse(x ?? 0))?.y ?? 0;
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
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default LineChart;
