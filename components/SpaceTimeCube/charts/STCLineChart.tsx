import {
  FC,
  SVGProps,
  useCallback,
  useMemo,
  useState,
  MouseEvent,
  useRef,
  useEffect,
} from "react";
import { LinePath } from "@visx/shape";
import { ScaleLinear } from "d3";
import RuleY from "../../RuleY";
import AxisX from "../../AxisX";
import AxisY from "../../AxisY";
import { format } from "d3";
import Tooltip from "../../Tooltip";
import { TooltipTrigger } from "../../Tooltip/TooltipTrigger";
import TooltipContent from "../../Tooltip/TooltipContent";
import KPI from "../../KPI";

type Data = {
  x: number;
  y: number;
  country: string;
};

type Props = {
  /** Where (within the parent element) should the timeline be positioned? */
  data: Data[][];
  width: number;
  height: number;
  yLabel?: string;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  margin: { top: number; bottom: number; left: number; right: number };
} & SVGProps<SVGSVGElement>;

/**
 * A wrapper components for a horizontal timeline off given dimensions.
 * @returns An svg group element, containing the timeline.
 */
const STCLineChart: FC<Props> = ({
  data,
  yLabel,
  width,
  height,
  xScale,
  yScale,
  margin,
  ...rest
}) => {
  const [cursorX, setCursorX] = useState<number | undefined>(undefined);
  const [lineX, setLineX] = useState<number | undefined>(undefined);
  const [left, setLeft] = useState<number | undefined>(undefined);
  const [top, setTop] = useState<number | undefined>(undefined);

  const pathRef = useRef<SVGPathElement>(null);

  const xScaleReverse = useMemo(
    () => (x: number) => Math.round(xScale.invert(x)),
    [xScale],
  );

  useEffect(() => {
    const bb = pathRef.current?.getBoundingClientRect();
    bb && setLineX(bb.x);
  }, [xScale, pathRef]);

  const onMouseMove = useCallback(
    (event: MouseEvent<SVGPathElement>) => {
      setCursorX(event.pageX);
      setLeft(event.pageX + 15);
      setTop(event.pageY - 15);
    },
    [setLeft, setTop, setCursorX],
  );

  const x = cursorX && lineX && Math.round(cursorX - lineX - 4);
  const getX = (d: Data): number => d.x;
  const getY = (d: Data): number => d.y;

  return (
    <svg width={width} height={height} {...rest}>
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="turquoise" />
          <stop offset="95%" stopColor="teal" />
        </linearGradient>
      </defs>
      <g>
        <RuleY xScale={xScale} yScale={yScale} />
        <AxisX
          top={height - margin.bottom + 5}
          tickFormat={format("4")}
          xScale={xScale}
        />
        <AxisY left={margin.left} yScale={yScale} />
        {data.map((datum, idx) => {
          return (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <g ref={pathRef}>
                  <LinePath<(typeof datum)[number]>
                    data={datum}
                    x={(d) => xScale(getX(d))}
                    y={(d) => yScale(getY(d))}
                    stroke={"url('#myGradient')"}
                    strokeWidth={1}
                    strokeLinejoin={"round"}
                    fill={"none"}
                    cursor="pointer"
                    onMouseMove={onMouseMove}
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent left={left} top={top}>
                <div>
                  <strong>{datum[0]?.country}</strong>
                  <br />
                  {cursorX ? xScaleReverse(x ?? 0) : undefined}
                  <br />
                  <KPI
                    number={
                      datum.find((d) => d.x === xScaleReverse(x ?? 0))?.y ?? 0
                    }
                  />
                  {yLabel && <div>{yLabel}</div>}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </g>
    </svg>
  );
};

export default STCLineChart;
