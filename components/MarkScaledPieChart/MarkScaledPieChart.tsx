import type { ComponentProps, FC } from "react";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";
import ScaledPieChart from "../ScaledPieChart";

export type pieDatum = {
  value: number;
  label: string;
};

type Props = Omit<ComponentProps<typeof ScaledPieChart>, "position"> & {
  lng: number;
  lat: number;
};

const MarkScaledPieChart: FC<Props> = ({ lat, lng, ...rest }) => {
  const { projection } = useMapLayoutContext();
  const [x, y] = projection([lng, lat]) ?? [undefined];
  return (
    <g transform={`translate(${x} ${y})`}>
      <ScaledPieChart {...rest} />
    </g>
  );
};

export default MarkScaledPieChart;
