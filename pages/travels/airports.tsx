import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import type { Topology } from "topojson-specification";
import { FeatureCollection, Point } from "geojson";
import Heading, { Headings } from "../../components/heading";
import getCountries from "../../lib/data/getCountries";
import getFlights from "../../lib/data/getFlights";
import BaseLayer from "../../components/map/BaseLayer";
import PointLabel from "../../components/map/PointLabel";
import PointSymbol from "../../components/map/PointSymbol";
import themes from "../../lib/styles/themes";

export async function getStaticProps() {
  const flights = await getFlights();
  const airports = flights.perAirport;
  const world = await getCountries();
  return {
    props: {
      airports,
      world,
    },
  };
}

const Airports: NextPage<{
  airports: FeatureCollection<Point>;
  world: Topology;
}> = ({ airports, world }) => {
  const projection = geoBertin1953();

  const airportsGeo: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: airports.features
      .filter((d) => d.properties?.iata_code != "AMS")
      .sort((a, b) => d3.descending(a.properties?.value, b.properties?.value)),
  };

  const flightCount = airportsGeo.features.map(
    (feature) => feature.properties?.value
  );
  const minRange = d3.min(flightCount);
  const maxRange = d3.max(flightCount);
  const scale = d3.scaleSqrt().domain([minRange, maxRange]).range([0, 30]);

  return (
    <>
      <Head>
        <title>Airports</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Airports</Heading>
        <svg width={1020} height={600}>
          <BaseLayer data={world} projection={projection} />
          {airportsGeo.features.map((airport) => (
            <PointSymbol
              style={themes.muted.symbol}
              xy={projection(airport.geometry.coordinates)}
              radius={scale(airport.properties?.value)}
            />
          ))}
          {airportsGeo.features.slice(0, 5).map((d) => (
            <PointLabel xy={projection(d.geometry.coordinates)}>
              <text>
                <tspan fontWeight={"bold"}>{d.properties?.["iata_code"]}</tspan>
                ({d.properties?.value})
              </text>{" "}
            </PointLabel>
          ))}
        </svg>
      </main>
    </>
  );
};

export default Airports;
