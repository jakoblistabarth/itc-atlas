import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import PageBase from "../../components/PageBase";
import BtorsByDepartment from "../../components/visuals/maps/BtorsByDepartment";
import getCountries from "../../lib/data/getCountries";
import getBtorsGroupedByRegionByDepartment, {
  BtorsGroupedByRegionByDepartment,
} from "../../lib/data/queries/btors/getBtorsGroupedByRegionByDepartment";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { SharedPageProps } from "../../types/Props";
import Container from "../../components/Container";
import Section from "../../components/Section";

type Props = SharedPageProps & {
  btorsByDepartment: BtorsGroupedByRegionByDepartment;
};

const Page: NextPage<Props> = ({
  neCountriesTopoJson,
  btorsByDepartment,
  countries,
}) => {
  return (
    <PageBase title="Travels by department">
      <Container>
        <main>
          <Section>
            <MapLayoutFluid projection={geoBertin1953()}>
              <BtorsByDepartment
                neCountries={neCountriesTopoJson}
                countryCodes={countries}
                btors={btorsByDepartment}
              />
            </MapLayoutFluid>
          </Section>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [btorsByDepartment, neCountriesTopoJson, countries] = await Promise.all(
    [getBtorsGroupedByRegionByDepartment(), getCountries(), getCountryCodes()],
  );

  return {
    props: {
      btorsByDepartment,
      neCountriesTopoJson,
      countries,
    },
  };
};
