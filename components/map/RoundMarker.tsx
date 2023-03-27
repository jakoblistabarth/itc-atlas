import { FC, SVGProps } from "react";
import { Vector2 } from "three";
import { Text } from "@visx/text";

type Props = {
  position: Vector2;
  label: string;
  labelColor?: string;
  fontSize?: number;
} & SVGProps<SVGCircleElement>;

const RoundMarker: FC<Props> = ({
  position,
  label,
  labelColor = "black",
  fontSize = 10,
  ...rest
}) => {
  return (
    <g transform={`translate(${position.x} ${position.y})`}>
      <circle {...rest} r={fontSize} />;
      <Text
        fill={labelColor}
        textAnchor="middle"
        fontWeight="bold"
        fontSize={fontSize}
        verticalAnchor="middle"
      >
        {label}
      </Text>
    </g>
  );
};

export default RoundMarker;
