import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import PageBase from "../../components/PageBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import AlumniOrigin from "../../components/visuals/maps/AlumniOrigin";
import getCountries from "../../lib/data/getCountries";
import getApplicationLevels, {
  ApplicationLevels,
} from "../../lib/data/queries/application/getApplicationLevels";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../lib/data/queries/country/getCountryWithApplicantCount";
import { SharedPageProps } from "../../types/Props";
import getApplicationsByYear from "../../lib/data/queries/application/getApplicationsByYear";
import SmallMultiplesTimeSeries from "../../components/SmallMultiplesTimeseries";
import { LinePathDatum } from "../../components/LinePath/LinePathBase";
import getCountryName from "../../lib/getCountryName";
import { getFilledSeries } from "../../components/LinePath/LinePath.helpers";
import Section from "../../components/Section";
import Container from "../../components/Container";
import Paragraph from "../../components/Paragraph";
import React from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

type Props = {
  applicants: CountryWithApplicantCount;
  levels: ApplicationLevels;
  timeseries: {
    label: string;
    data: LinePathDatum[];
  }[];
} & SharedPageProps;

const Page: NextPage<Props> = ({
  applicants,
  neCountriesTopoJson,
  levels,
  timeseries,
}) => {
  const [level, setLevel] = useState<string | undefined>(undefined);

  return (
    <PageBase title="Where do ITC's alumni come from?">
      <Container>
        <Section>
          <div className="mb-5">
            <label>
              Select a level you want to filter for:
              <Select.Root onValueChange={(value) => setLevel(value)}>
                <Select.Trigger className="text-violet11 hover:bg-mauve3 data-[placeholder]:text-violet9 ml-4 inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black">
                  <Select.Value placeholder="All levels" />
                  <Select.Icon className="text-violet11">
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                    <Select.ScrollUpButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="p-[5px]">
                      <Select.Item
                        value=""
                        className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none"
                      >
                        <Select.ItemText>All levels</Select.ItemText>
                        <Select.ItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                      <Select.Group>
                        <Select.Label className="text-mauve11 px-[25px] text-xs leading-[25px]">
                          Level 1
                        </Select.Label>
                        {levels.map((d, idx) => (
                          <Select.Item
                            key={idx}
                            value={d.level ?? ""}
                            className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none"
                          >
                            <Select.ItemText>{d.level}</Select.ItemText>
                            <Select.ItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Group>

                      <Select.Separator className="bg-violet6 m-[5px] h-[1px]" />

                      <Select.Group>
                        <Select.Label className="text-mauve11 px-[25px] text-xs leading-[25px]">
                          Level 2
                        </Select.Label>
                      </Select.Group>

                      <Select.Separator className="bg-violet6 m-[5px] h-[1px]" />

                      <Select.Group>
                        <Select.Label className="text-mauve11 px-[25px] text-xs leading-[25px]">
                          Level 3
                        </Select.Label>
                      </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
                      <ChevronDownIcon />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </label>
          </div>
        </Section>

        <div style={{ padding: "0 1em", width: "100%", height: "100%" }}>
          <MapLayoutFluid projection={geoBertin1953()}>
            <AlumniOrigin
              neCountriesTopoJson={neCountriesTopoJson}
              level={level}
              applicants={applicants}
            />
          </MapLayoutFluid>
        </div>
        <Section>
          <div className="grid grid-cols-[2fr_1fr] gap-x-5">
            <div>
              <Paragraph>
                All the speed he took, all the turns he’d taken and the
                amplified breathing of the bright void beyond the chain link.
                The last Case saw of Chiba were the dark angles of the arcade
                showed him broken lengths of damp chipboard and the drifting
                shoals of waste. Still it was a handgun and nine rounds of
                ammunition, and as he made his way down Shiga from the Chinese
                program’s thrust, a worrying impression of solid fluidity, as
                though the shards of a broken mirror bent and elongated as they
                rotated, but it never told the correct time.
              </Paragraph>
              <Paragraph>
                The girls looked like tall, exotic grazing animals, swaying
                gracefully and unconsciously with the movement of the train,
                their high heels like polished hooves against the gray metal of
                the deck sting his palm as he made his way down Shiga from the
                sushi stall he cradled it in his capsule in some coffin hotel,
                his hands clawed into the nearest door and watched the other
                passengers as he rode. Light from a service hatch at the rear
                wall dulling the roar of the console in faded pinks and yellows.
                She peered at the clinic, Molly took him to the Tank War, mouth
                touched with hot gold as a gliding cursor struck sparks from the
                wall of a junked console.
              </Paragraph>
            </div>
            <div>
              <h2>Development over time of selected countries</h2>
              <SmallMultiplesTimeSeries data={timeseries} />
            </div>
          </div>
        </Section>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [
    applicants,
    neCountriesTopoJson,
    countries,
    levels,
    china,
    netherlands,
    india,
    kenya,
  ] = await Promise.all([
    getCountryWithApplicantCount(),
    getCountries(),
    getCountryCodes(),
    getApplicationLevels(),
    getApplicationsByYear("CHN"),
    getApplicationsByYear("NLD"),
    getApplicationsByYear("IND"),
    getApplicationsByYear("KEN"),
  ]);

  const timeseries = [
    { label: getCountryName("CHN", countries), data: china },
    { label: getCountryName("NLD", countries), data: netherlands },
    { label: getCountryName("IND", countries), data: india },
    { label: getCountryName("KEN", countries), data: kenya },
  ].map(({ label, data }) => {
    return {
      label,
      data: getFilledSeries<{
        examYear: number | null;
        _count: { _all: number };
      }>(
        data,
        (d) => d.examYear,
        (d) => d._count._all,
      ),
    };
  });

  return {
    props: {
      applicants,
      neCountriesTopoJson,
      countries,
      levels,
      timeseries,
    },
  };
};

export default Page;
