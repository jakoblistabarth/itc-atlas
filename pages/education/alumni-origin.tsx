import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import Container from "../../components/Container";
import { getFilledSeries } from "../../components/LinePath/LinePath.helpers";
import { LinePathDatum } from "../../components/LinePath/LinePathBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import PageBase from "../../components/PageBase";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Select from "../../components/Select";
import SmallMultiplesTimeSeries from "../../components/SmallMultiplesTimeseries";
import AlumniOrigin from "../../components/visuals/maps/AlumniOrigin";
import getCountries from "../../lib/data/getCountries";
import getApplicationLevels, {
  ApplicationLevels,
} from "../../lib/data/queries/application/getApplicationLevels";
import getApplicationsByYear from "../../lib/data/queries/application/getApplicationsByYear";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithApplicantCount, {
  CountryWithApplicantCount,
} from "../../lib/data/queries/country/getCountryWithApplicantCount";
import getCountryName from "../../lib/getCountryName";
import { SharedPageProps } from "../../types/Props";

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
          <div className="mb-5 flex items-center gap-5">
            <BiFilterAlt />
            <Select
              label={"Level"}
              activeValue={level}
              onChangeHandler={setLevel}
              placeholder="Select a level…"
              options={levels
                .filter((d) => d.level != null)
                .map((d) => d.level as string)}
              withReset
            />
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
