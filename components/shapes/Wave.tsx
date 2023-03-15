import { path } from "d3";
import { FC, SVGProps } from "react";

type Props = {
  width: number;
  height: number;
  amplitude: number;
  frequency: number;
} & SVGProps<SVGPathElement>;

const Wave: FC<Props> = ({
  width,
  height,
  amplitude = 1,
  frequency = 1,
  ...rest
}) => {
  const yOffset = (height / 2) * amplitude;
  const period = width / frequency;
  const wavePath = path();

  wavePath.moveTo(0, -yOffset);
  for (let i = 0; i < width; i += period) {
    wavePath.bezierCurveTo(
      i + period / 4,
      -yOffset,
      i + period / 4,
      yOffset,
      i + period / 2,
      yOffset
    );
    wavePath.bezierCurveTo(
      i + period - period / 4,
      yOffset,
      i + period - period / 4,
      -yOffset,
      i + period,
      -yOffset
    );
  }
  return <path d={wavePath.toString()} {...rest} />;
};

export default Wave;
