import type { NextPage } from "next";
import PageBase from "../../components/PageBase";
import getCountries from "../../lib/data/getCountries";
import getOdMatrix from "../../lib/data/getOdMatrix";
import type { OdMatrix } from "../../types/OdMatrix";
import { SharedPageProps } from "../../types/Props";
import Container from "../../components/Container";
import Flights from "../../components/Flights";

type Props = {
  odMatrix: OdMatrix;
} & SharedPageProps;

const Flights2019: NextPage<Props> = ({ odMatrix, neCountriesTopoJson }) => {
  return (
    <PageBase title="ITC's travel activity">
      <Container>
        <main>
          <Flights
            odMatrix={odMatrix}
            neCountriesTopoJson={neCountriesTopoJson}
          />
        </main>
      </Container>
    </PageBase>
  );
};

export async function getStaticProps() {
  const neCountriesTopoJson = getCountries();
  const [odMatrix] = await Promise.all([getOdMatrix()]);
  return {
    props: {
      odMatrix,
      neCountriesTopoJson,
    },
  };
}

export default Flights2019;
