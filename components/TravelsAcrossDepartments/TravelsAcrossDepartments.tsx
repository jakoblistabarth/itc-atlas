import { Department } from "@prisma/client";
import { GeoProjection } from "d3-geo";
import { FC, memo, useState } from "react";
import type { Topology } from "topojson-specification";
import { BtorsGroupedByCountryByDepartment } from "../../lib/data/queries/btors/getBtorsGroupedByCountryByDepartment";
import PrismMapTravelsDepartment from "../PrismMapTravelsDepartment";
import * as Select from "@radix-ui/react-select";
import { RxCheck, RxChevronDown, RxChevronUp } from "react-icons/rx";

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
      <label className="my-5 flex items-center">
        Department:
        <Select.Root
          key={activeDepartment.id}
          value={activeDepartment.id}
          onValueChange={(value) => {
            const department = departments.find((d) => d.id === value);
            if (department) setActiveDepartment(department);
          }}
        >
          <Select.Trigger className="ml-4 inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none text-itc-green shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-itc-green-100 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-itc-green">
            <Select.Value />
            <Select.Icon className="text-itc-green">
              <RxChevronDown />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
              <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-itc-green">
                <RxChevronUp />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-[5px]">
                {departments.map(({ id, name }) => {
                  return !id ? (
                    <></>
                  ) : (
                    <Select.Item
                      key={id}
                      value={id}
                      className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-itc-blue data-[disabled]:pointer-events-none data-[highlighted]:bg-itc-green-100 data-[disabled]:text-white data-[highlighted]:text-itc-green data-[highlighted]:outline-none"
                    >
                      <Select.ItemText>{`${name} (${id})`}</Select.ItemText>
                      <Select.ItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
                        <RxCheck />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-itc-green">
                <RxChevronDown />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </label>
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
