import { geoPath } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import { FC } from "react";
import { CiPalette } from "react-icons/ci";
import { MdTour } from "react-icons/md";
import { Step } from "react-joyride";
import FlightsFlowMap from "../FlightsFlowMap";
import MapLayerBase from "../MapLayerBase";
import MapLayerTissotsIndicatrices from "../MapLayerTissotsIndicatrices";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MarkCircle from "../MarkCircle";
import Tour from "../Tour";
import type { OdMatrix } from "../../types/OdMatrix";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";

type Props = {
  odMatrix: OdMatrix;
  neCountriesTopoJson: NeCountriesTopoJson;
};

const Flights: FC<Props> = ({ odMatrix, neCountriesTopoJson }) => {
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
        <div className="text-left">
          <p className="font-serif">
            <CiPalette className="mb-[-1rem] mr-2" />
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
            <table className="text-xs">
              <tr>
                <td className="pr-3">Alias</td>
                <td className="pr-3">Bertin1953</td>
              </tr>
              <tr>
                <td className="pr-3">Domain</td>
                <td className="pr-3">2D</td>
              </tr>
              <tr>
                <td className="pr-3">formulation</td>
                <td className="pr-3">Philippe Rivière (2017)</td>
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
    <div>
      <MapLayoutFluid projection={geoBertin1953()}>
        <FlightsFlowMap
          odMatrix={odMatrix}
          neCountriesTopoJson={neCountriesTopoJson}
        />
        <Targets />
      </MapLayoutFluid>
      <Tour steps={steps} />
      {/* TODO: implement tour restarting */}
      <button
        className="flex items-center bg-itc-green-50 p-2"
        onClick={() => {
          console.log("restarting tour …");
        }}
      >
        <MdTour className="mr-2" />
        Restart Tour
      </button>
    </div>
  );
};

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
