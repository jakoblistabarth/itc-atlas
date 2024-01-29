import { Department } from "@prisma/client";
import { GeoProjection } from "d3-geo";
import { FC, memo, useState } from "react";
import type { Topology } from "topojson-specification";
import { BtorsGroupedByCountryByDepartment } from "../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import PrismMapTravelsDepartment from "../PrismMapTravelsDepartment";
import Select from "../Select";

type Props = {
  btorsByCountryByDepartment: BtorsGroupedByCountryByDepartment;
  topology: Topology;
  topologyObject: string;
  projection: GeoProjection;
  width: number;
  length: number;
  departments: Department[];
};

const TravelsAcrossDepartmentsPrismMap: FC<Props> = ({
  btorsByCountryByDepartment,
  topology,
  topologyObject,
  projection,
  width,
  length,
  departments,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<Department>(
    departments[0],
  );

  return (
    <div>
      <Select
        label="Department"
        options={departments.map(({ id }) => id)}
        onChangeHandler={(value) => {
          const newDepartment = departments.find((d) => d.id === value);
          newDepartment && setActiveDepartment(newDepartment);
        }}
        activeValue={activeDepartment.id}
        initialValue={departments[0].id}
        optionLabels={departments.map((d) => (
          <div key={d.id} className="flex gap-1">
            {d.name}
            <span className="font-bold">{d.id}</span>
          </div>
        ))}
      />
      <MemoizedPrismMapTravelsDepartment
        btorsByCountryByDepartment={btorsByCountryByDepartment}
        topology={topology}
        topologyObject={topologyObject}
        projection={projection}
        width={width}
        length={length}
        department={activeDepartment}
        extrudeGeometryOptions={{
          depth: 0.01,
          bevelSize: 0.005,
          bevelThickness: 0.005,
          bevelSegments: 12,
        }}
      />
    </div>
  );
};

const MemoizedPrismMapTravelsDepartment = memo(PrismMapTravelsDepartment);

export default TravelsAcrossDepartmentsPrismMap;
