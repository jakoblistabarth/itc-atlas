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
            Hover individual sphere-markers to only see projects related to this
            country and country name and number of projects for this country
            will show in the tooltip.
          </Callout>
          <ProjectGlobe
            neCountriesTopoJson={neCountriesTopoJson}
            countryWithProjectCount={countryWithProjectCount}
          />
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
