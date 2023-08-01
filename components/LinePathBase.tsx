/** @jsxImportSource theme-ui */

import { FC, SVGProps } from "react";
import { LinePath } from "@visx/shape";
import { ScaleLinear } from "d3";

type Datum = { x: number; y: number };

type Props = {
  xScale: ScaleLinear<number | string, number, never>;
  yScale: ScaleLinear<number | string, number, never>;
  isSelected: boolean;
  isSelection: boolean;
  isFocus: boolean;
  data: Datum[];
} & Omit<SVGProps<SVGPathElement>, "x" | "y" | "children">;

const LinePathBase: FC<Props> = ({
  xScale,
  yScale,
  isSelected,
  isSelection,
  isFocus,
  data,
  ...rest
}) => {
  return (
    <LinePath
      data={data}
      x={(d) => xScale(d.x)}
      y={(d) => yScale(d.y)}
      strokeWidth={isSelected || isFocus ? 2 : 0.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      sx={{ transition: "opacity .5s" }}
      opacity={isSelected || (!isSelection && isFocus) ? 1 : 0.05}
      cursor="pointer"
      {...rest}
    />
  );
};

export default LinePathBase;
