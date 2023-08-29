import { FC, SVGProps } from "react";
import { Text } from "@visx/text";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

type Props = {
  lng: number;
  lat: number;
  label: string;
  labelColor?: string;
  fontSize?: number;
} & SVGProps<SVGCircleElement>;

const MarkGlyph: FC<Props> = ({
  lng,
  lat,
  label,
  labelColor = "black",
  fontSize = 10,
  ...rest
}) => {
  const { projection } = useMapLayoutContext();
  const [x, y] = projection([lng, lat]) ?? [undefined];
  return (
    <g transform={`translate(${x} ${y})`}>
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

export default MarkGlyph;
