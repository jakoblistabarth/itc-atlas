import { format } from "d3";
import { FC } from "react";

type Props = { number: number; unit?: string };

const KPI: FC<Props> = ({ number, unit }) => (
  <div>
    <p className="text-4xl font-thin">{format(",~r")(number)}</p>
    {unit && <p className="text-xs font-bold">{unit}</p>}
  </div>
);

export default KPI;
