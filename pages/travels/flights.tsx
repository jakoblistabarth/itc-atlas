import { geoBertin1953 } from "d3-geo-projection";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import BaseMap from "../../components/map/BaseMap";
import styles from "../../styles/home.module.css";
import getFlights from "../../lib/getFlights";
import getCountries from "../../lib/getCountries";
import { FeatureCollection, LineString } from "geoJSON";
import { Topology } from "topojson-specification";
import ArrowHead from "../../components/map/ArrowHead";
import FlowLayer from "../../components/map/FlowLayer";

type Props = {
  odMatrix: FeatureCollection<LineString>;
  world: Topology;
};

const Flights: NextPage<Props> = ({ odMatrix, world }) => {
  const projection = geoBertin1953();
  const svgRef = useRef(null);

  useEffect(() => {
    // setData(json.data)
    // setFilteredData(json.data)
  });

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
        <h1>Flights</h1>
        <svg ref={svgRef} width={1020} height={600}>
          <defs>
            <ArrowHead id="arrowHead" color="red" />
          </defs>
          <BaseMap baseMapData={world} projection={projection} />
          <FlowLayer projection={projection} flowData={odMatrix} />
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
  const flights = await getFlights();
  const world = await getCountries();
  return {
    props: {
      odMatrix: flights.odMatrix,
      world,
    },
  };
}

export default Flights;
