import { FC } from "react";

type Props = { number: number; unit?: string };

const KPI: FC<Props> = ({ number, unit }) => (
  <div>
    <p className="text-4xl font-thin">{number}</p>
    {unit && <p className="text-xs font-bold">{unit}</p>}
  </div>
);

export default KPI;
