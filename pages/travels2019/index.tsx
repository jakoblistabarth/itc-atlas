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

type Props = {
  odMatrix: OdMatrix;
  airports: FeatureCollection<Point, AirportPropertiesWithCount>;
} & SharedPageProps;

const Page: NextPage<Props> = ({ odMatrix, airports, neCountriesTopoJson }) => {
  return (
    <div>
      <PageBase title="ITC's travels in 2019">
        <Container>
          <Section>
            <h2>Flights</h2>
            <Paragraph>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
              molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
              suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
              incidunt fuga perferendis!
            </Paragraph>
            <Flights
              odMatrix={odMatrix}
              neCountriesTopoJson={neCountriesTopoJson}
            />
          </Section>
          <Section>
            <h2>Flights3D</h2>
            <Paragraph>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
              molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
              suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
              incidunt fuga perferendis!
            </Paragraph>
            <Flights3D odMatrix={odMatrix} />
          </Section>
          <Section>
            <h2>Airports</h2>
            <Paragraph>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
              molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
              suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
              incidunt fuga perferendis!
            </Paragraph>
            <Airports
              airports={airports}
              neCountriesTopoJson={neCountriesTopoJson}
            />
          </Section>
        </Container>
      </PageBase>
    </div>
  );
};

export async function getStaticProps() {
  const neCountriesTopoJson = getCountries();
  const [odMatrix] = await Promise.all([getOdMatrix()]);
  const [airports, countries] = await Promise.all([
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
