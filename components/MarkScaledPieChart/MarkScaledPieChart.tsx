import type { ComponentProps, FC } from "react";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";
import ScaledPieChart from "../ScaledPieChart";

export type pieDatum = {
  value: number;
  label: string;
};

type Props = Omit<ComponentProps<typeof ScaledPieChart>, "position"> & {
  longitude: number;
  latitude: number;
};

const MarkScaledPieChart: FC<Props> = ({ latitude, longitude, ...rest }) => {
  const { projection } = useMapLayoutContext();
  const [x, y] = projection([longitude, latitude]) ?? [undefined];
  return (
    <g transform={`translate(${x} ${y})`}>
      <ScaledPieChart {...rest} />
    </g>
  );
};

export default MarkScaledPieChart;
