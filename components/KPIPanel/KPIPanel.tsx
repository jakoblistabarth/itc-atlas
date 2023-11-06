import { FC } from "react";
import { Card } from "../Card";
import KPI from "../KPI/";

type Props = {
  data: { value: number; unit: string; description?: string }[];
};

const KPIPanel: FC<Props> = ({ data }) => {
  return (
    <div>
      <h2>KPI&apos;s</h2>
      <div className="flex gap-5">
        {data.map((d, i) => {
          return (
            <Card key={i}>
              <Card.Body>
                <KPI number={d.value} unit={d.unit} />
              </Card.Body>
              {d.description && (
                <Card.Footer>
                  <p className="text-xs">{d.description}</p>
                </Card.Footer>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default KPIPanel;
