import type { NextPage } from "next";
import PageBase from "../../components/PageBase";
import getCountries from "../../lib/data/getCountries";
import getOdMatrix from "../../lib/data/getOdMatrix";
import type { OdMatrix } from "../../types/OdMatrix";
import { SharedPageProps } from "../../types/Props";
import Container from "../../components/Container";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import { FeatureCollection, Point } from "geojson";
import getFlightsPerAirport, {
  AirportPropertiesWithCount,
} from "../../lib/data/getFlightsPerAirport";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import Flights from "../../components/Flights";
import Flights3D from "../../components/Flights3D";
import Airports from "../../components/Airports";
import CanvasStage from "../../components/CanvasStage";
import Caption from "../../components/Caption";

type Props = {
  odMatrix: OdMatrix;
  airports: FeatureCollection<Point, AirportPropertiesWithCount>;
} & SharedPageProps;

const Page: NextPage<Props> = ({ odMatrix, airports, neCountriesTopoJson }) => {
  return (
    <div>
      <PageBase title="Lookig closely – staff travels in 2019">
        <Container>
          <Section>
            <Paragraph>
              Next we offer a look into more detail look on a single year. 2019,
              a pre-covid year was selected and all flights booked by our travel
              agency are included. Train or car trips as well as fight arranged
              via other agencies are not included. The first of those map show
              all single trips between airport visited. To distinguish between
              to and from opposite curves have been draw, clearly visible
              between Amsterdam and Eastern Africa. The map highlights the five
              more frequented trips (the flight Nairobi-Amsterdam was used 106
              times) [1]. The same data was mapped on an interactive 3D-globe
              [2]
            </Paragraph>
            <Paragraph>
              The flow map in [1] and [2] show an interesting pattern of ITC
              travel behaviour, but an alternative look might clarify part of
              the pattern seen. In [3] all the arrivals and departures for
              individual airports are mapped. Obviously Amsterdam is most
              frequently use since it can be considers ITC’s home base. Nairobi,
              Addis Abeba, and Kigali are in focus countries, but Dubai is
              certainly not. These days it is a typical hub to fly to parts of
              Asia and Africa.
            </Paragraph>
            <figure className="my-5">
              <Flights
                odMatrix={odMatrix}
                neCountriesTopoJson={neCountriesTopoJson}
              />
              <Caption reference="Fig.1">
                Number of single flights between airports in 2019.
              </Caption>
            </figure>
          </Section>
          <Section>
            <h2>Flights of 2019 on a globe</h2>
            <figure>
              <CanvasStage className="mt-5">
                <Flights3D odMatrix={odMatrix} />
              </CanvasStage>
              <Caption reference="Fig.2">
                Number of single flights between airports in 2019 on interactive
                3D globe.
              </Caption>
            </figure>
          </Section>
          <Section>
            <h2>Airports</h2>
            <figure>
              <Airports
                airports={airports}
                neCountriesTopoJson={neCountriesTopoJson}
              />
              <Caption reference="Fig.3">Airport destinations.</Caption>
            </figure>
          </Section>
        </Container>
      </PageBase>
    </div>
  );
};

export async function getStaticProps() {
  const neCountriesTopoJson = getCountries();
  const [odMatrix, airports, countries] = await Promise.all([
    getOdMatrix(),
    getFlightsPerAirport(),
    getCountryCodes(),
  ]);
  return {
    props: {
      odMatrix,
      neCountriesTopoJson,
      airports,
      countries,
    },
  };
}

export default Page;
