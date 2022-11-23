import { path } from "d3";
import { FC, SVGProps } from "react";

type Props = {
  width: number;
  height: number;
} & SVGProps<SVGPathElement>;

const Wave: FC<Props> = ({ width, height, ...rest }) => {
  const yOffset = height / 2;
  const wavePath = path();
  wavePath.moveTo(0, -yOffset);
  wavePath.bezierCurveTo(
    width / 4,
    -yOffset,
    width / 4,
    yOffset,
    width / 2,
    yOffset
  );
  wavePath.bezierCurveTo(
    width - width / 4,
    yOffset,
    width - width / 4,
    -yOffset,
    width,
    -yOffset
  );
  return <path d={wavePath.toString()} {...rest} />;
};

export default Wave;
