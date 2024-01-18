import { FeatureCollection, Point } from "geojson";
import type { GetStaticProps, NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import getCountries from "../../lib/data/getCountries";
import getFlightsPerAirport, {
  AirportPropertiesWithCount,
} from "../../lib/data/getFlightsPerAirport";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { SharedPageProps } from "../../types/Props";
import Airports from "../../components/Airports";

type Props = {
  airports: FeatureCollection<Point, AirportPropertiesWithCount>;
} & SharedPageProps;

const Airports2019: NextPage<Props> = ({ airports, neCountriesTopoJson }) => {
  return (
    <PageBase title="Airports">
      <Container>
        <main>
          <Airports
            airports={airports}
            neCountriesTopoJson={neCountriesTopoJson}
          />
        </main>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const [airports, countries] = await Promise.all([
    getFlightsPerAirport(),
    getCountryCodes(),
  ]);

  return {
    props: {
      airports,
      countries,
      neCountriesTopoJson,
    },
  };
};

export default Airports2019;
