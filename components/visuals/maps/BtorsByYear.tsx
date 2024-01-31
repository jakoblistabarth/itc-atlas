import { Country } from "@prisma/client";
import * as Popover from "@radix-ui/react-popover";
import { groups, max, min, scaleOrdinal, scaleSqrt } from "d3";
import { FC } from "react";
import { RxCross2 } from "react-icons/rx";
import { Vector2 } from "three";
import getCentroidByIsoCode from "../../../lib/data/getCentroidByIsoCode";
import { BtorsGroupedByYear } from "../../../lib/data/queries/btors/getBtorsGroupedByYear";
import getCountryName from "../../../lib/getCountryName";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import LineChart from "../../LineChart";
import { getFilledSeries } from "../../LinePath/LinePath.helpers";
import MapLayerBase from "../../MapLayerBase";
import MarkCircle from "../../MarkCircle";
import LegendProportionalCircle from "../../LegendProportionalCircle";
import { fInt } from "../../../lib/utilities/formaters";

type Props = {
  countries: Country[];
  neCountries: NeCountriesTopoJson;
  btors: BtorsGroupedByYear;
};

const BtorsByYear: FC<Props> = ({ btors, countries, neCountries }) => {
  const minTime = min(btors, (d) => d.year) ?? 2000;
  const maxTime = max(btors, (d) => d.year) ?? new Date().getFullYear();
  const maxCountPerYear = max(btors, (d) => d.count) ?? 1;

  type BtorCountry = {
    isoAlpha3: string;
    data: typeof btors;
    centroid: Vector2 | undefined;
  };
  type BtorCountryWithValidCentroid = BtorCountry & {
    centroid: Vector2;
  };

  const hasCentroid = (
    btor: BtorCountryWithValidCentroid | BtorCountry,
  ): btor is BtorCountryWithValidCentroid => {
    return btor.centroid?.x !== undefined && btor.centroid?.y !== undefined;
  };

  const btorsByCountry = groups(btors, (d) => d.isoAlpha3)
    .map(([isoAlpha3, data]) => ({
      isoAlpha3,
      data,
      centroid: getCentroidByIsoCode(isoAlpha3),
    }))
    .filter(({ isoAlpha3 }) => isoAlpha3)
    .filter(hasCentroid);
  const btorsByCountrySum = btorsByCountry.map((d) => {
    return d.data.reduce((acc, d) => (acc += d.count), 0);
  }, 0);
  const maxCountPerCountry = max(btorsByCountrySum) ?? 1;
  const scaleRadius = scaleSqrt()
    .domain([0, maxCountPerCountry])
    .range([0, 20]);

  return (
    <>
      <LegendProportionalCircle
        data={btorsByCountrySum}
        scaleRadius={scaleRadius}
        title={"No. of trips"}
        unitLabel={"trip"}
      />
      <MapLayerBase countries={neCountries} />
      {btorsByCountry.map((d) => {
        const label = getCountryName(d.isoAlpha3, countries);
        const data = {
          id: d.isoAlpha3,
          label,
          data: getFilledSeries<(typeof d.data)[number]>(
            d.data,
            (d) => d.year,
            (d) => d.count,
            minTime,
            maxTime,
          ),
        };
        const total = data.data.reduce((acc, d) => (acc += d.y), 0);
        return (
          <Popover.Root key={d.isoAlpha3}>
            <Popover.Trigger asChild className="group">
              <g>
                <MarkCircle
                  longitude={d.centroid.x}
                  latitude={d.centroid.y}
                  radius={scaleRadius(total)}
                  className="fill-itc-green stroke-itc-green transition-all hover:fill-itc-blue hover:stroke-itc-blue  group-data-[state=open]:fill-itc-blue group-data-[state=open]:stroke-itc-blue group-data-[state=open]:stroke-2"
                />
              </g>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={5}
                className="max-w-sm rounded-sm bg-white p-3 shadow-lg"
              >
                <Popover.Arrow className="fill-white" />
                <div className="flex items-center">
                  <span className="text-xs">
                    {fInt(total)} travels over time
                  </span>
                  <Popover.Close className="ml-auto rounded-full p-1 hover:bg-itc-green-50">
                    <RxCross2 />
                  </Popover.Close>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="font-serif text-lg">{label}</span>
                  <span className="rounded border border-itc-blue p-1 text-xs text-itc-blue">
                    {d.isoAlpha3}
                  </span>
                </div>
                <LineChart
                  data={[data]}
                  colorScale={scaleOrdinal<string, string>().range([
                    "darkblue",
                  ])}
                  mouseEnterLeaveHandler={() => undefined}
                  xLabel="year"
                  xTickCount={Math.floor((maxTime - minTime) / 5)}
                  yTickCount={5}
                  yLabel="No. travels"
                  yDomain={[0, maxCountPerYear]}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        );
      })}
    </>
  );
};

export default BtorsByYear;
