import { Department } from "@prisma/client";
import { GeoProjection } from "d3-geo";
import { FC, memo, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { Topology } from "topojson-specification";
import { BtorsGroupedByCountryByDepartment } from "../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import PrismMapTravelsDepartment from "../PrismMapTravelsDepartment";

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
      <div className="pn-2 scroll mb-2 mt-2 flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap">
        {departments.map((department) => (
          <button
            key={department.id}
            className={twMerge(
              "min-w-[80px] rounded-sm border border-solid",
              activeDepartment.id === department.id && "border-itc-green",
            )}
            onClick={() => setActiveDepartment(department)}
          >
            {department.id}
          </button>
        ))}
      </div>
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
