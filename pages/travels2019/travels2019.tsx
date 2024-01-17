import { geoPath } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import type { NextPage } from "next";
import { CiPalette } from "react-icons/ci";
import { MdTour } from "react-icons/md";
import { Step } from "react-joyride";
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
import Container from "../../components/Container";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as d3 from "d3";
import type { GeoJsonProperties } from "geojson";
import { FC, Suspense, memo, useCallback, useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import Globe, { FallBackGlobe } from "../../components/Globe/";
import GlobeEnvironment from "../../components/Globe/GlobeEnvironment";
import KPI from "../../components/KPI";
import Mark3dFlow from "../../components/Mark3dFlow";
import Tooltip from "../../components/Tooltip";
import { useTheme } from "next-themes";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import { FeatureCollection, Point } from "geojson";
import { Vector2 } from "three";
import LabelPoint from "../../components/LabelPoint";
import LegendProportionalCircle from "../../components/LegendProportionalCircle";
import getFlightsPerAirport, {
  AirportPropertiesWithCount,
} from "../../lib/data/getFlightsPerAirport";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { fInt } from "../../lib/utilities/formaters";

type Props = {
  odMatrix: OdMatrix;
  airports: FeatureCollection<Point, AirportPropertiesWithCount>;
} & SharedPageProps;

const earthRadius = 1;

const Travels2019: NextPage<Props> = ({
  odMatrix,
  airports,
  neCountriesTopoJson,
}) => {
  const projection = geoBertin1953();
  //flights const
  const Tissot = () => {
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

  //flights3D const
  const [hoverInfo, setHoverInfo] = useState<GeoJsonProperties | undefined>(
    undefined,
  );
  const onPointerEnterHandler = useCallback((properties: GeoJsonProperties) => {
    setHoverInfo(properties);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);

  const [ready, setReady] = useState(false);

  const { theme } = useTheme();

  //airports const
  const airportsGeo: FeatureCollection<Point, AirportPropertiesWithCount> = {
    type: "FeatureCollection",
    features: airports.features.sort((a, b) =>
      d3.descending(a.properties?.value, b.properties?.value),
    ),
  };

  const flightCount = airportsGeo.features.map(
    (feature) => feature.properties.value,
  );
  const minRange = d3.min(flightCount);
  const maxRange = d3.max(flightCount);
  const scale = d3
    .scaleSqrt()
    .domain([minRange ?? 0, maxRange ?? 10])
    .range([0, 30]);

  return (
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
            <button
              className="flex items-center bg-itc-green-50 p-2"
              onClick={() => {
                console.log("restarting tour …");
              }}
            >
              <MdTour className="mr-2" />
              Restart Tour
            </button>
          </main>
        </Section>

        <Section>
          <h2>Flights3D</h2>
          <Paragraph>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
            molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
            suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
            incidunt fuga perferendis!
          </Paragraph>
          <main>
            <div style={{ width: "100%", height: "700px" }}>
              <Tooltip.Root
                open={!!hoverInfo}
                followCursor
                placement="top-start"
              >
                <Tooltip.Trigger asChild>
                  <Canvas
                    camera={{ position: [0, 0, 5], fov: 30 }}
                    shadows
                    onCreated={() => setReady(true)}
                    data-ready={ready}
                  >
                    <Suspense fallback={<FallBackGlobe radius={earthRadius} />}>
                      <Globe
                        radius={earthRadius}
                        texture={theme === "dark" ? "night" : "explorer"}
                      />
                    </Suspense>
                    <GlobeEnvironment />

                    <MemoizedFlows
                      odMatrix={odMatrix}
                      onPointerEnterHandler={onPointerEnterHandler}
                      onPointerLeaveHandler={onPointerLeaveHandler}
                    />
                    <OrbitControls
                      makeDefault
                      enableDamping
                      dampingFactor={0.3}
                      enableZoom={false}
                      enablePan={false}
                    />
                  </Canvas>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  {hoverInfo &&
                    (hoverInfo.name ? (
                      <p>
                        Airport:{" "}
                        <span className="font-bold">{hoverInfo.name}</span>
                      </p>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{hoverInfo?.o}</span>{" "}
                          <HiArrowRight />{" "}
                          <span className="font-bold">{hoverInfo?.d}</span>
                        </div>
                        <br />
                        <KPI number={hoverInfo.value} unit={"travels"} />
                        <p>in 2019</p>
                      </div>
                    ))}
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          </main>
        </Section>

        <Section>
          <h2>Airports</h2>
          <Paragraph>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet
            molestiae, sequi animi est dolor nihil qui id, aperiam assumenda
            suscipit officia, veniam tenetur veritatis saepe! Recusandae animi
            incidunt fuga perferendis!
          </Paragraph>
          <main>
            <MapLayoutFluid projection={projection}>
              <MapLayerBase countries={neCountriesTopoJson} />
              {airportsGeo.features.map(({ geometry, properties }) => {
                return (
                  <Tooltip.Root key={properties.iata_code}>
                    <Tooltip.Content>
                      <strong>{properties?.["iata_code"]}</strong>
                      &nbsp;{properties?.name}
                      <br />
                      {fInt(properties?.value)} flights (incoming/outgoing)
                    </Tooltip.Content>
                    <Tooltip.Trigger asChild>
                      <g>
                        <MarkCircle
                          longitude={geometry.coordinates[0]}
                          latitude={geometry.coordinates[1]}
                          radius={scale(properties?.value)}
                          {...defaultTheme.symbol}
                        />
                      </g>
                    </Tooltip.Trigger>
                  </Tooltip.Root>
                );
              })}
              {airportsGeo.features.slice(0, 5).map((airport) => {
                const coords = projection(airport.geometry.coordinates);
                return (
                  <LabelPoint
                    key={airport.properties.iata_code}
                    position={new Vector2(coords[0], coords[1])}
                  >
                    <tspan fontWeight={"bold"}>
                      {airport.properties?.["iata_code"]}
                    </tspan>
                    ({airport.properties?.value})
                  </LabelPoint>
                );
              })}
              <g>
                <LegendProportionalCircle
                  data={airports.features.map(
                    (feature) => feature.properties?.value,
                  )}
                  scaleRadius={scale}
                  title={"Flights per Airport"}
                  unitLabel={"flight"}
                  showFunction={false}
                />
              </g>
            </MapLayoutFluid>
          </main>
        </Section>
      </Container>
    </PageBase>
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

export default Travels2019;

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

const Flows: FC<{
  odMatrix: OdMatrix;
  onPointerEnterHandler?: (properties: GeoJsonProperties) => void;
  onPointerLeaveHandler?: () => void;
}> = ({ odMatrix, onPointerEnterHandler, onPointerLeaveHandler }) => {
  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value,
  );
  const min = d3.min(flightsPerRoute);
  const max = d3.max(flightsPerRoute);
  const scaleWidth = d3
    .scaleLinear()
    .domain([min ?? 0, max ?? 100])
    .range([0, 100]);
  return (
    <>
      {/* {odMatrix.flows.features.map((flow) => { */}
      {odMatrix.flows.features.map((flow) => {
        const originPosition = flow.geometry.coordinates[0];
        const originAirport = flow.properties.o;
        const destinationPosition = flow.geometry.coordinates[1];
        const destinationAirport = flow.properties.d;
        return (
          <Mark3dFlow
            key={flow.properties.od}
            origin={{
              position: originPosition,
              airport: originAirport,
            }}
            destination={{
              position: destinationPosition,
              airport: destinationAirport,
            }}
            value={scaleWidth(flow.properties?.value)}
            data={flow.properties}
            onPointerEnterHandler={(props) =>
              onPointerEnterHandler && onPointerEnterHandler(props)
            }
            onPointerLeaveHandler={() =>
              onPointerLeaveHandler && onPointerLeaveHandler()
            }
          />
        );
      })}
    </>
  );
};

const MemoizedFlows = memo(Flows);
