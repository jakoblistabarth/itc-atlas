import { FeatureCollection, Point } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import ProjectGlobe from "../../components/ProjectGlobe";
import Section from "../../components/Section";
import getCountries from "../../lib/data/getCountries";
import getProjectsPerCountry from "../../lib/data/getProjectsPerCountry";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithProjectCount, {
  CountryWithProjectCount,
} from "../../lib/data/queries/country/getCountryWithProjectCount";
import { SharedPageProps } from "../../types/Props";
import ProjectsByCountries from "../../components/ProjectsByCountries";
import Teaser from "../../components/Teaser";
import Callout from "../../components/Callout";
import Caption from "../../components/Caption";
import Paragraph from "../../components/Paragraph";

type Props = SharedPageProps & {
  countryWithProjectCount: CountryWithProjectCount;
  data: FeatureCollection<Point>;
  domain: [number, number];
};

const Page: NextPage<Props> = ({
  neCountriesTopoJson,
  countryWithProjectCount,
  data,
  domain,
}) => {
  return (
    <PageBase title="Projects by Country">
      <Container>
        <Teaser>Geographic distribution of ITC projects.</Teaser>
        <Section>
          <Paragraph>
            Both maps below give a different perspective on where projects have
            been executed. There are obviously many projects in the focus
            countries, but most projects have been done in The Netherlands and
            other European countries. This because the project portfolio not
            only includes projects financed by Dutch development aid, but also
            by Dutch and European research funding agencies. These often have
            requirements regarding (local) partners, and ITC is also asked by
            those Dutch and European parties to be project partner.
          </Paragraph>
        </Section>
        <Section>
          <Callout>
            Hover over the spheres to retrieve the precise number of projects
            per country. You can rotate the globe.
          </Callout>
          <figure>
            <ProjectGlobe
              neCountriesTopoJson={neCountriesTopoJson}
              countryWithProjectCount={countryWithProjectCount}
            />
            <Caption reference="Fig.1">
              Different global perspectives on the number of ITC projects since
              1990.
            </Caption>
          </figure>
        </Section>
        <Section>
          <figure>
            <ProjectsByCountries
              data={data}
              domain={domain}
              neCountriesTopoJson={neCountriesTopoJson}
            />
            <Caption reference="Fig.2">
              Number of ITC project per country since 1990.
            </Caption>
          </figure>
        </Section>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const [countries, countryWithProjectCount, { data, domain }] =
    await Promise.all([
      getCountryCodes(),
      getCountryWithProjectCount(),
      getProjectsPerCountry(),
    ]);

  return {
    props: {
      countries,
      neCountriesTopoJson,
      countryWithProjectCount,
      data,
      domain,
    },
  };
};

export default Page;
