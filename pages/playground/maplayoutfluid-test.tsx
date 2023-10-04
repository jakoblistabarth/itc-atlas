/** @jsxImportSource theme-ui */

import {
  ExtendedFeature,
  GeoGeometryObjects,
  geoEquirectangular,
} from "d3-geo";
import type { GetStaticProps, NextPage } from "next";
import PageBase from "../../components/PageBase";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import TestMap from "../../components/visuals/maps/TestMap";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { SharedPageProps } from "../../types/Props";
import { Box } from "theme-ui";
import Caption from "../../components/Caption";
import { geoBertin1953 } from "d3-geo-projection";
import BtorsByYearMap from "../../components/visuals/maps/BtorsByYear";
import getBtorsGroupedByYear, {
  BtorsGroupedByYear,
} from "../../lib/data/queries/btors/getBtorsGroupedByYear";

type Props = { btorsByYear: BtorsGroupedByYear } & SharedPageProps;

const Page: NextPage<Props> = ({ neCountriesTopoJson, btorsByYear }) => {
  const extent: ExtendedFeature = {
    type: "Feature",
    geometry: {
      type: "MultiPoint",
      coordinates: [
        [-30, 60],
        [48, 70],
        [34, 36],
        [-8, 35],
      ],
    },
    properties: {},
  };

  const extentAut: GeoGeometryObjects = {
    type: "MultiPoint",
    coordinates: [
      [17.551025542474036, 46.3324345054358],
      [9.320452238531516, 46.3324345054358],
      [9.320452238531516, 49.233738108932954],
      [17.551025542474036, 49.233738108932954],
    ],
  };

  return (
    <PageBase title="MapLayoutFluid test">
      <Box variant="layout.inlineMap">
        <MapLayoutFluid projection={geoEquirectangular()} extent={extentAut}>
          <TestMap neCountriesTopoJson={neCountriesTopoJson} />
        </MapLayoutFluid>
        <Caption reference="Fig. 1">
          This map uses an Equirectangular projection.
        </Caption>
      </Box>
      <Box variant="layout.inlineMap">
        <MapLayoutFluid projection={geoBertin1953()} extent={extent}>
          <BtorsByYearMap
            neCountries={neCountriesTopoJson}
            btors={btorsByYear}
          />
        </MapLayoutFluid>
        <Caption reference="Fig. 2">
          This map uses the Bertin projection.
        </Caption>
      </Box>
      <Box variant="layout.inlineMap">
        <MapLayoutFluid projection={geoEquirectangular()} extent={extent}>
          <BtorsByYearMap
            neCountries={neCountriesTopoJson}
            btors={btorsByYear}
          />
        </MapLayoutFluid>
        <Caption reference="Fig. 3">
          This map uses an Equirectangular projection.
        </Caption>
      </Box>
      <Box variant="layout.inlineMap">
        <MapLayoutFluid projection={geoEquirectangular()} extent={extent}>
          <TestMap neCountriesTopoJson={neCountriesTopoJson} />
        </MapLayoutFluid>
        <Caption reference="Fig. 4">
          This map uses an Equirectangular projection.
        </Caption>
      </Box>
    </PageBase>
  );
};
export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [countries, neCountriesTopoJson, btorsByYear] = await Promise.all([
    getCountryCodes(),
    getCountries(),
    getBtorsGroupedByYear(),
  ]);

  return {
    props: {
      neCountriesTopoJson,
      countries,
      btorsByYear,
    },
  };
};
