/** @jsxImportSource theme-ui */

import { geoPath } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import type { NextPage } from "next";
import { CiPalette } from "react-icons/ci";
import { MdTour } from "react-icons/md";
import { Step } from "react-joyride";
import { Button, Container } from "theme-ui";
import FlightsFlowMap from "../../components/FlightsFlowMap";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayerTissotsIndicatrices from "../../components/MapLayerTissotsIndicatrices";
import { useMapLayoutContext } from "../../components/MapLayout/MapLayoutContext";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import MarkCircle from "../../components/MarkCircle";
import PageBase from "../../components/PageBase";
import Tour from "../../components/Tour";
import getCountries from "../../lib/data/getCountries";
import getOdMatrix from "../../lib/data/getOdMatrix";
import type { OdMatrix } from "../../types/OdMatrix";
import { SharedPageProps } from "../../types/Props";

type Props = {
  odMatrix: OdMatrix;
} & SharedPageProps;

const Flights: NextPage<Props> = ({ odMatrix, neCountriesTopoJson }) => {
  const Tissot = () => {
    const projection = geoBertin1953();
    return (
      <MapLayoutFluid projection={projection}>
        <MapLayerBase countries={neCountriesTopoJson} />
        <MapLayerTissotsIndicatrices radius={3} step={30} />
      </MapLayoutFluid>
    );
  };

  const steps: Step[] = [
    {
      content: (
        <>
          <h3>Hub Nairobi</h3>
          <p>
            NBO, the Nairobi airport is one of the most frequently travelled
            airports by ITC staff.
          </p>
        </>
      ),
      target: "#target1",
    },
    {
      content: (
        <div sx={{ textAlign: "left" }}>
          <p sx={{ fontFamily: "heading", mt: 0 }}>
            <CiPalette sx={{ mb: -1, mr: 2 }} />
            Design
          </p>
          <Tissot />
          <p>
            This map uses the <em>Bertin Projection</em>. It is named by its
            French creator Jacques Bertin. In the center of the equal area
            projection is Europe (Paris), where Bertin worked and lived.
          </p>
          <details>
            <summary>More</summary>
            <table sx={{ fontSize: 1, td: { pr: 3 } }}>
              <tr>
                <td>Alias</td>
                <td>Bertin1953</td>
              </tr>
              <tr>
                <td>Domain</td>
                <td>2D</td>
              </tr>
              <tr>
                <td>formulation</td>
                <td>Philippe Rivière (2017)</td>
              </tr>
            </table>
          </details>
        </div>
      ),
      target: "#target2",
    },
    {
      content: (
        <div>
          Southasia has always been an important area of activity for ITC.
        </div>
      ),
      target: "#target3",
    },
  ];

  return (
    <PageBase title="ITC's travel activity">
      <Container>
        <main>
          <MapLayoutFluid projection={geoBertin1953()}>
            <FlightsFlowMap
              odMatrix={odMatrix}
              neCountriesTopoJson={neCountriesTopoJson}
            />
            <Targets />
          </MapLayoutFluid>
          <Tour steps={steps} />
          {/* TODO: implement tour restarting */}
          <Button
            variant="muted"
            onClick={() => {
              console.log("restarting tour …");
            }}
          >
            <MdTour style={{ marginRight: 5 }} />
            Restart Tour
          </Button>
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

export default Flights;

const Targets = () => {
  const { width, height, projection } = useMapLayoutContext();
  return (
    <g>
      <MarkCircle
        latitude={-1.329}
        longitude={36.9238}
        radius={1}
        id="target1"
        fill="transparent"
        opacity={0.25}
      />
      <path
        id="target2"
        d={geoPath(projection)({ type: "Sphere" }) ?? ""}
        fill="transparent"
      />
      <circle
        id="target3"
        r={50}
        fill="transparent"
        stroke={"black"}
        cx={width / 1.5}
        cy={height / 2}
      />
    </g>
  );
};
