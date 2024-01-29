import { FeatureCollection, Point } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import ProjectGlobe from "../../components/ProjectGlobe";
import Section from "../../components/Section";
import getCountries from "../../lib/data/getCountries";
import getCountriesByGroup from "../../lib/data/getCountriesByGroup";
import getProjectsPerCountry from "../../lib/data/getProjectsPerCountry";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithProjectCount, {
  CountryWithProjectCount,
} from "../../lib/data/queries/country/getCountryWithProjectCount";
import { NeCountriesGeoJson } from "../../types/NeCountriesGeoJson";
import { SharedPageProps } from "../../types/Props";
import { UnGrouping } from "../../types/UnsdCodes";
import ProjectsByCountries from "../../components/ProjectsByCountries";
import Teaser from "../../components/Teaser";
import Callout from "../../components/Callout";
import Caption from "../../components/Caption";

type Props = SharedPageProps & {
  countryWithProjectCount: CountryWithProjectCount;
  data: FeatureCollection<Point>;
  domain: [number, number];
  highlightCountries: NeCountriesGeoJson;
};

const Page: NextPage<Props> = ({
  neCountriesTopoJson,
  countryWithProjectCount,
  highlightCountries,
  data,
  domain,
}) => {
  return (
    <PageBase title="Projects by Country">
      <Container>
        <Teaser>Teaser text goes here.</Teaser>
        <Section>
          <Callout>
            Hover over the spheres to retrieve the precise number of projects
            per country.
          </Callout>
          <figure>
            <ProjectGlobe
              neCountriesTopoJson={neCountriesTopoJson}
              countryWithProjectCount={countryWithProjectCount}
            />
            <Caption reference="Fig.1">
              The 3D globe shows the number of projects carried out per country.
            </Caption>
          </figure>
        </Section>
        <Section>
          <ProjectsByCountries
            data={data}
            domain={domain}
            highlightCountries={highlightCountries}
            neCountriesTopoJson={neCountriesTopoJson}
          />
        </Section>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const [
    countries,
    countryWithProjectCount,
    { data, domain },
    highlightCountries,
  ] = await Promise.all([
    getCountryCodes(),
    getCountryWithProjectCount(),
    getProjectsPerCountry(),
    getCountriesByGroup(UnGrouping.LDC),
  ]);

  return {
    props: {
      countries,
      neCountriesTopoJson,
      countryWithProjectCount,
      data,
      domain,
      highlightCountries,
    },
  };
};

export default Page;
