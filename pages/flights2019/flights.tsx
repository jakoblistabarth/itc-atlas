import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { nanoid } from "nanoid";
import type { NextPage } from "next";
import Head from "next/head";
import Heading, { Headings } from "../../components/Heading";
import BaseLayer from "../../components/map/BaseLayer";
import FlowLayer from "../../components/map/FlowLayer";
import FlowLegend from "../../components/map/FlowLegend";
import PointLabel from "../../components/map/PointLabel";
import getFlowPoints from "../../lib/cartographic/getFlowPoints";
import getCountries from "../../lib/data/getCountries";
import styles from "../../styles/Home.module.css";
import type { OdMatrix } from "../../types/OdMatrix";
import themes, { ThemeNames } from "../../lib/styles/themes";
import getMapHeight from "../../lib/cartographic/getMapHeight";
import { MapOptions } from "../../types/MapOptions";
import { SharedPageProps } from "../../types/Props";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Vector2 } from "three";
import getOdMatrix from "../../lib/data/getOdMatrix";

type Props = {
  odMatrix: OdMatrix;
} & SharedPageProps;

const Flights: NextPage<Props> = ({ odMatrix, neCountriesTopoJson }) => {
  const mapOptions: MapOptions = {
    projection: geoBertin1953(),
    bounds: {
      width: 1280,
      height: 0,
    },
    theme: themes.get(ThemeNames.ETH) ?? defaultTheme,
    styles: {
      flowStyle: {
        opacity: 0.2,
        stroke: "red",
        markerEnd: "tip",
      },
      pointStyle: {
        fill: "grey",
        fillOpacity: 1,
        strokeWidth: 0,
      },
    },
  };

  mapOptions.bounds.height = getMapHeight(
    mapOptions.bounds.width,
    mapOptions.projection
  );

  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value
  );
  const min = d3.min(flightsPerRoute);
  const max = d3.max(flightsPerRoute);
  const scaleWidth = d3
    .scaleLinear()
    .domain([min ?? 0, max ?? 1])
    .range([1, 15]);

  // useEffect(() => {
  // setData(json.data)
  // setFilteredData(json.data)
  // });

  // const [selectedCountry, setSelectedCountry] = useState(null)
  // const [filterData, setFilteredData] = useState(null)
  // const [data, setData] = useState(null)

  //   setFilteredData(data.filter(d => d > selectedCountry))
  // }, [selectedCountry])

  return (
    <>
      <Head>
        <title>Flights</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC&apos;s travel activity</Heading>

        <svg width={mapOptions.bounds.width} height={mapOptions.bounds.height}>
          <BaseLayer
            countries={neCountriesTopoJson}
            theme={mapOptions.theme}
            projection={mapOptions.projection}
          />
          <FlowLayer
            projection={mapOptions.projection}
            data={odMatrix}
            scaleWidth={scaleWidth}
            flowStyle={mapOptions.styles?.flowStyle}
            pointStyle={mapOptions.styles?.pointStyle}
          />

          {odMatrix.flows.features.slice(0, 5).map((d) => {
            const flowPoints = getFlowPoints(d, mapOptions.projection);
            const labelPosition = flowPoints?.[1];
            return (
              labelPosition && (
                <PointLabel
                  key={nanoid()}
                  position={new Vector2(labelPosition[0], labelPosition[1])}
                >
                  <tspan fontWeight="bold">{d.properties?.od}</tspan>(
                  {d.properties?.value})
                </PointLabel>
              )
            );
          })}
          <FlowLegend
            data={odMatrix.flows.features.map((flow) => flow.properties?.value)}
            scaleWidth={scaleWidth}
            title="No. of flights in 2019"
            unitLabel="flights"
            style={mapOptions.styles?.flowStyle}
          />
        </svg>

        {/* <select onChange={(e) => setSelectedCountry(e.target.value)}></select>
        <Navigation>
        <Flowmap thematicData={filteredData} geographicData="" />
        <Flowmap thematicData=" " geographicData="" /> */}
      </main>
    </>
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
