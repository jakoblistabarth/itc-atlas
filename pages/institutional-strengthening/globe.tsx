import type { GetStaticProps, NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import ProjectGlobe from "../../components/ProjectGlobe";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getCountryWithProjectCount, {
  CountryWithProjectCount,
} from "../../lib/data/queries/country/getCountryWithProjectCount";
import { SharedPageProps } from "../../types/Props";
import Callout from "../../components/Callout";
import Section from "../../components/Section";
import Caption from "../../components/Caption";

type Props = SharedPageProps & {
  countryWithProjectCount: CountryWithProjectCount;
};

const Page: NextPage<Props> = ({
  neCountriesTopoJson,
  countryWithProjectCount,
}) => {
  return (
    <PageBase title="Projects Explorer">
      <Container>
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
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const countries = await getCountryCodes();
  const countryWithProjectCount = await getCountryWithProjectCount();

  return {
    props: {
      countries,
      neCountriesTopoJson,
      countryWithProjectCount,
    },
  };
};

export default Page;
