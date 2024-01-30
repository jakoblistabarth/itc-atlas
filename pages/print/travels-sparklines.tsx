import type { NextPage } from "next";
import PagePaperCanvas from "../../components/PagePaperCanvas";
import getCountries from "../../lib/data/getCountries";
import getBtorsGroupedByYear, {
  BtorsGroupedByYear,
} from "../../lib/data/queries/btors/getBtorsGroupedByYear";
import { SharedPageProps } from "../../types/Props";
import BtorsByCountryByYear from "../../components/BtorsByCountryByYear";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import { geoBertin1953 } from "d3-geo-projection";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";

type Props = {
  btors: BtorsGroupedByYear;
} & SharedPageProps;

const Page: NextPage<Props> = ({ btors, countries, neCountriesTopoJson }) => {
  const projection = geoBertin1953();
  return (
    <PagePaperCanvas title="BTORs by country by year">
      <div className="min-w-[80vw]"></div>
      <MapLayoutFluid projection={projection}>
        <BtorsByCountryByYear
          btors={btors}
          countryCodes={countries}
          neCountriesTopoJson={neCountriesTopoJson}
        />
      </MapLayoutFluid>
    </PagePaperCanvas>
  );
};

export async function getStaticProps() {
  const neCountriesTopoJson = getCountries();
  const btors = await getBtorsGroupedByYear();
  const countries = await getCountryCodes();
  return {
    props: {
      btors,
      neCountriesTopoJson,
      countries,
    },
  };
}

export default Page;
