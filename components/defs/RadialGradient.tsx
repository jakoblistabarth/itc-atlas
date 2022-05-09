import { nanoid } from "nanoid";
import { FC } from "react";

const RadialGradient: FC<{
  colorStops: colorStop[];
  id: string;
}> = ({ colorStops, id }) => {
  return (
    <radialGradient id={id}>
      {colorStops.map((colorStop) => (
        <stop
          key={nanoid()}
          offset={`${colorStop.stop}%`}
          stopColor={colorStop.color}
        />
      ))}
    </radialGradient>
  );
};

export default RadialGradient;
