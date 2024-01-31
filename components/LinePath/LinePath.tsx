import {
  FC,
  useCallback,
  useMemo,
  useState,
  MouseEvent,
  useRef,
  useEffect,
} from "react";
import LinePathBase, { LinePathDatum } from "./LinePathBase";
import Tooltip from "../Tooltip/";
import { ScaleLinear, ascending, range } from "d3";
import KPI from "../KPI";

type Props = {
  mouseEnterLeaveHandler: (identifier?: string) => void;
  xScale: ScaleLinear<number | string, number, never>;
  yScale: ScaleLinear<number | string, number, never>;
  color?: string | string[];
  identifier: string;
  label?: string;
  xLabel?: string;
  yLabel?: string;
  isSelection: boolean;
  isFocus: boolean;
  isSelected: boolean;
  data: LinePathDatum[];
};

const LinePath: FC<Props> = ({
  mouseEnterLeaveHandler,
  xScale,
  yScale,
  xLabel,
  yLabel,
  color = "black",
  identifier,
  label,
  isSelected,
  isSelection,
  isFocus,
  data,
}) => {
  const [cursorX, setCursorX] = useState<number | undefined>(undefined);
  const [lineX, setLineX] = useState<number | undefined>(undefined);

  const pathRef = useRef<SVGPathElement>(null);

  const xScaleReverse = useMemo(
    () => (x: number) => Math.round(xScale.invert(x)),
    [xScale],
  );

  useEffect(() => {
    const bb = pathRef.current?.getBoundingClientRect();
    bb && setLineX(bb.x);
  }, [pathRef]);

  const onMouseMove = useCallback(
    (event: MouseEvent<SVGPathElement>) => {
      setCursorX(event.pageX);
    },
    [setCursorX],
  );

  const onMouseLeave = useCallback(
    () => mouseEnterLeaveHandler(undefined),
    [mouseEnterLeaveHandler],
  );
  const onMouseEnter = useCallback(
    () => mouseEnterLeaveHandler(identifier),
    [mouseEnterLeaveHandler, identifier],
  );

  const x = cursorX && lineX && Math.round(cursorX - lineX);

  return (
    <>
      <Tooltip.Root followCursor placement="top-start" offset={20}>
        <Tooltip.Trigger asChild>
          <g ref={pathRef}>
            {Array.isArray(color) ? (
              range(color.length).map((i) => (
                <LinePathBase
                  key={i}
                  data={data.sort((a, b) => ascending(a.x, b.x))}
                  xScale={xScale}
                  yScale={yScale}
                  fill="none"
                  stroke={color[i]}
                  strokeDasharray={`${5} ${5 * (color.length - 1)}`}
                  strokeDashoffset={i * -5}
                  isFocus={isFocus}
                  isSelected={isSelected}
                  isSelection={isSelection}
                  cursor="pointer"
                  onMouseMove={onMouseMove}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              ))
            ) : (
              <LinePathBase
                data={data.sort((a, b) => ascending(a.x, b.x))}
                xScale={xScale}
                yScale={yScale}
                fill="none"
                stroke={color}
                isFocus={isFocus}
                isSelected={isSelected}
                isSelection={isSelection}
                onMouseMove={onMouseMove}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
            )}
          </g>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <strong>{label ?? identifier}</strong>
          <br />
          {xLabel && <>{xLabel}: </>}
          {cursorX ? xScaleReverse(x ?? 0) : undefined}
          <br />
          <KPI
            number={data.find((d) => d.x === xScaleReverse(x ?? 0))?.y ?? 0}
          />
          {yLabel && <div>{yLabel}</div>}
        </Tooltip.Content>
      </Tooltip.Root>
      {isSelected && (
        <>
          <line
            stroke="grey"
            strokeWidth={0.5}
            x1={x}
            x2={x}
            y1={yScale.range()[0]}
            y2={yScale.range()[1]}
            pointerEvents={"none"}
          />
          <circle
            cx={xScale(xScaleReverse(x ?? 0))}
            cy={yScale(data.find((d) => d.x === xScaleReverse(x ?? 0))?.y ?? 0)}
            fill="transparent"
            strokeWidth={1}
            pointerEvents={"none"}
            stroke={Array.isArray(color) ? color[0] : color}
            r={4}
          />
        </>
      )}
    </>
  );
};

export default LinePath;
