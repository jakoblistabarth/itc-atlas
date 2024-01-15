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
import * as Select from "@radix-ui/react-select";
import { RxCheck, RxChevronDown, RxChevronUp } from "react-icons/rx";
import { BiFilterAlt } from "react-icons/bi";
import { RxReset } from "react-icons/rx";

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
  console.log(level ?? "no selected");

  return (
    <PageBase title="Where do ITC's alumni come from?">
      <Container>
        <Section>
          <div className="mb-5 flex items-center gap-5">
            <BiFilterAlt />
            <label>
              Course level:
              <Select.Root
                key={level}
                value={level}
                onValueChange={(value) => setLevel(value)}
              >
                <Select.Trigger className="ml-4 inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none text-itc-green shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-itc-green-100 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-itc-green">
                  <Select.Value placeholder="Select a level…" />
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
                      {levels.map((d, idx) => (
                        <Select.Item
                          key={idx}
                          value={d.level}
                          className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-itc-blue data-[disabled]:pointer-events-none data-[highlighted]:bg-itc-green-100 data-[disabled]:text-white data-[highlighted]:text-itc-green data-[highlighted]:outline-none"
                        >
                          <Select.ItemText>{d.level}</Select.ItemText>
                          <Select.ItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
                            <RxCheck />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-itc-green">
                      <RxChevronDown />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </label>
            <button
              disabled={!level}
              onClick={() => setLevel(undefined)}
              className="flex items-center gap-2 rounded p-1 px-2 shadow-sm transition-shadow hover:bg-itc-green-50 disabled:cursor-not-allowed disabled:hover:bg-inherit"
            >
              <RxReset /> Reset
            </button>
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
