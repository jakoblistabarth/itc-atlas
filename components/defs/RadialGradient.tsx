import { FC } from "react";

type ColorStop = {
  color: string;
  stop: number;
};

const RadialGradient: FC<{
  colorStops: ColorStop[];
  id: string;
}> = ({ colorStops, id }) => {
  return (
    <radialGradient id={id}>
      {colorStops.map((colorStop, idx) => (
        <stop
          key={idx}
          offset={`${colorStop.stop}%`}
          stopColor={colorStop.color}
        />
      ))}
    </radialGradient>
  );
};

export default RadialGradient;
