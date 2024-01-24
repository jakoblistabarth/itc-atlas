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
import Paragraph from "../../components/Paragraph";
import Teaser from "../../components/Teaser";

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
        <main>
          <Teaser>
            ITC and changing government policies illustrated by its activities
            in Indonesia.
          </Teaser>
          <Paragraph>
            Dutch development policies change over time. According to the
            cabinets in office the perspective and focus on development shifts
            slighty, affecting ITC&apos;s work.
          </Paragraph>

          <ProjectGlobe
            neCountriesTopoJson={neCountriesTopoJson}
            countryWithProjectCount={countryWithProjectCount}
          />
        </main>
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
