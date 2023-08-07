/** @jsxImportSource theme-ui */

import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import { Box, Paragraph } from "theme-ui";
import BasePage from "../../components/BasePage";
import MapLayoutFluid from "../../components/map/layout/MapLayoutFluid";
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
import { LinePathDatum } from "../../components/LinePathBase";
import getCountryName from "../../lib/getCountryName";
import { getFilledSeries } from "../../components/LinePath/LinePath.helpers";

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
    <BasePage title="Where do ITC's alumni come from?">
      <Box as="section" variant="layout.section">
        <div sx={{ mb: 3 }}>
          <label>
            Select a level you want to filter for:
            <select
              sx={{ ml: 2 }}
              name="level"
              onChange={(event) => setLevel(event.target.value)}
              placeholder={"none selected"}
            >
              <option value={""}>All levels</option>
              {levels.map((d) => (
                <option value={d.level ?? ""} key={d.level}>
                  {d.level}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Box>

      <div style={{ padding: "0 1em", width: "100%", height: "100%" }}>
        <MapLayoutFluid projection={geoBertin1953()}>
          <AlumniOrigin
            neCountriesTopoJson={neCountriesTopoJson}
            level={level}
            applicants={applicants}
          />
        </MapLayoutFluid>
      </div>
      <Box as="section" variant="layout.section">
        <Box
          sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", columnGap: 5 }}
        >
          <Box>
            <Paragraph>
              All the speed he took, all the turns he’d taken and the amplified
              breathing of the bright void beyond the chain link. The last Case
              saw of Chiba were the dark angles of the arcade showed him broken
              lengths of damp chipboard and the drifting shoals of waste. Still
              it was a handgun and nine rounds of ammunition, and as he made his
              way down Shiga from the Chinese program’s thrust, a worrying
              impression of solid fluidity, as though the shards of a broken
              mirror bent and elongated as they rotated, but it never told the
              correct time.
            </Paragraph>
            <Paragraph>
              The girls looked like tall, exotic grazing animals, swaying
              gracefully and unconsciously with the movement of the train, their
              high heels like polished hooves against the gray metal of the deck
              sting his palm as he made his way down Shiga from the sushi stall
              he cradled it in his capsule in some coffin hotel, his hands
              clawed into the nearest door and watched the other passengers as
              he rode. Light from a service hatch at the rear wall dulling the
              roar of the console in faded pinks and yellows. She peered at the
              clinic, Molly took him to the Tank War, mouth touched with hot
              gold as a gliding cursor struck sparks from the wall of a junked
              console.
            </Paragraph>
          </Box>
          <Box>
            <h3 sx={{ fontFamily: "heading", mt: 0 }}>
              Development over time of selected countries
            </h3>
            <SmallMultiplesTimeSeries data={timeseries} />
          </Box>
        </Box>
      </Box>
    </BasePage>
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
    { label: getCountryName("CHN", neCountriesTopoJson), data: china },
    { label: getCountryName("NLD", neCountriesTopoJson), data: netherlands },
    { label: getCountryName("IND", neCountriesTopoJson), data: india },
    { label: getCountryName("KEN", neCountriesTopoJson), data: kenya },
  ].map(({ label, data }) => {
    return {
      label,
      data: getFilledSeries<{
        examYear: number | null;
        _count: { _all: number };
      }>(
        data,
        (d) => d.examYear,
        (d) => d._count._all
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
