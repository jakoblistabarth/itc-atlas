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
import Teaser from "../../components/Teaser";

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
        <Teaser>ITC’s global population</Teaser>
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
                .map((d) => d.level as string)
                .sort()
                .reverse()}
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
                ITC&apos;s alumni population is a truely global population.
                Finding a country without an alumnus is nearly impossible. The
                map shows some distinct patterns. It is obvious that most alumni
                are found in the focus countries with a concentration in Africa,
                Latin America, and South East Asia. Two countries might need
                more attention since they do not fit the pattern: the
                Netherlands and China. Many students registered at Dutch
                universities and companies have followed our specialized (short)
                courses to complement their own study program or update their
                knowledge. This is also the case for most European alumni,
                although the joint MSc are also a source of alumni. In the early
                days China was still considered a developing country and
                students received a fellowships. During the last decades the
                Chinese government is issuing many fellowship and student select
                ITC as place of study. The graphs below the map demonstrate
                this. It also show how in general student number have risen over
                time.
              </Paragraph>
              <Paragraph>
                More interesting patterns emerge when the alumni are split by
                the level of their courses: PhD, MSc, Diploma, and Certificate.
                The pattern seen for the certificate level is more or less equal
                to the overall pattern because student took (tailor-made) short
                courses or special modules from an MSc or Diploma course. The
                pattern for the Diploma courses very much concentrates on
                Africa, the Middle East, and south East Asia. These are for
                instance alumni from mapping organisation who followed a more
                practical training. Tanzania, Ghana jump out because we had a
                copy of our diploma course running at local universities. The
                pattern for MSc course is again more or less similar to the
                overall pattern. Joint MSc programs with universities in China,
                India and Iran are visible. In the Netherlands all student from
                the joint GIMA MSc are included too. The PhD pattern is
                dominated by China and Iran with student supported by the local
                government and India by Dutch development. Europe stands out
                because many EU projects and staff Phd&apos;s.
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
