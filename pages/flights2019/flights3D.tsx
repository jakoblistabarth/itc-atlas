import type { NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import getOdMatrix from "../../lib/data/getOdMatrix";
import type { OdMatrix } from "../../types/OdMatrix";
import Flights3D from "../../components/Flights3D";

type Props = {
  odMatrix: OdMatrix;
};

const Flights3D2019: NextPage<Props> = ({ odMatrix }) => {
  return (
    <PageBase title="ITC's travel activity">
      <Container>
        <main>
          <Flights3D odMatrix={odMatrix} />
        </main>
      </Container>
    </PageBase>
  );
};

export async function getStaticProps() {
  const odMatrix = await getOdMatrix();
  return {
    props: {
      odMatrix,
    },
  };
}

export default Flights3D2019;
