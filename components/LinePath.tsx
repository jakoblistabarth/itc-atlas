/** @jsxImportSource theme-ui */

import { FC, useCallback, useMemo, useState, MouseEvent } from "react";
import LinePathBase from "./LinePathBase";
import Tooltip from "./Tooltip/Tooltip";
import { TooltipTrigger } from "./Tooltip/TooltipTrigger";
import TooltipContent from "./Tooltip/TooltipContent";
import { ScaleLinear, ascending, range } from "d3";

type Props = {
  mouseEnterLeaveHandler: (identifier?: string) => void;
  xScale: ScaleLinear<number | string, number, never>;
  yScale: ScaleLinear<number | string, number, never>;
  color?: string | string[];
  identifier: string;
  xLabel?: string;
  yLabel?: string;
  isSelection: boolean;
  isFocus: boolean;
  isSelected: boolean;
  data: { x: number; y: number }[];
};

const LinePath: FC<Props> = ({
  mouseEnterLeaveHandler,
  xScale,
  yScale,
  xLabel = "x",
  yLabel = "y",
  color = "black",
  identifier,
  isSelected,
  isSelection,
  isFocus,
  data,
}) => {
  const [cursorPositionX, setX] = useState<number | undefined>(undefined);
  const [left, setLeft] = useState<number | undefined>(undefined);
  const [top, setTop] = useState<number | undefined>(undefined);

  const xScaleRevers = useMemo(
    () => (x: number) => Math.round(xScale.invert(x)),
    [xScale]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent<SVGPathElement>) => {
      setX(event.nativeEvent.offsetX);
      setLeft(event.pageX + 15);
      setTop(event.pageY - 15);
    },
    [setLeft, setTop, setX]
  );

  const onMouseLeave = useCallback(
    () => mouseEnterLeaveHandler(undefined),
    [mouseEnterLeaveHandler]
  );
  const onMouseEnter = useCallback(
    () => mouseEnterLeaveHandler(identifier),
    [mouseEnterLeaveHandler, identifier]
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g>
          {Array.isArray(color) ? (
            range(color.length).map((i) => (
              <LinePathBase
                key={i}
                data={data.sort((a, b) => ascending(a.x, b.x))}
                xScale={xScale}
                yScale={yScale}
                stroke={color[i]}
                strokeDasharray={`${5} ${5 * (color.length - 1)}`}
                strokeDashoffset={i * -5}
                isFocus={isFocus}
                isSelected={isSelected}
                isSelection={isSelection}
                cursor="pointer"
                onMouseMove={onMouseMove}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseEnter}
              />
            ))
          ) : (
            <LinePathBase
              data={data.sort((a, b) => ascending(a.x, b.x))}
              xScale={xScale}
              yScale={yScale}
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
      </TooltipTrigger>
      <TooltipContent left={left} top={top}>
        <div>
          <strong>{identifier}</strong>
          <br />
          {xLabel}:{" "}
          {cursorPositionX ? xScaleRevers(cursorPositionX) : undefined}
          <br />
          {yLabel}:{" "}
          {data.find((d) => d.x === xScaleRevers(cursorPositionX ?? 0))?.y}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default LinePath;
