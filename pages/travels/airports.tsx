import * as d3 from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef } from "react";
import styles from "../../styles/Home.module.css";
import createBaseMap from "../../lib/createBaseMap";
import Layout from "../../components/layout";
import { server } from "../../config";
import { TopoJSON } from "topojson-specification";
import { FeatureCollection } from "geojson";
import Heading, { Headings } from "../../components/heading";

export async function getStaticProps() {
  const res = await fetch(`${server}/api/data/flights`);
  const list = await res.json();
  const airports = list.perAirport;
  const worldRes = await fetch(`${server}/api/data/geo/countries`);
  const world = await worldRes.json();
  return {
    props: {
      airports,
      world,
    },
  };
}

const Airports: NextPage<{
  airports: FeatureCollection;
  world: TopoJSON;
}> = ({ airports, world }) => {
  useEffect(() => {
    const maxRadius = 50;
    const airportsGeo = airports.features
      .filter((d) => d.properties.iata_code != "AMS")
      .sort((a, b) => {
        return d3.descending(a.properties.value, b.properties.value);
      });

    const scale = d3
      .scaleSqrt()
      .domain(d3.extent(airportsGeo.map((feature) => feature.properties.value)))
      .range([0, maxRadius]);

    const projection = geoBertin1953();

    const svgEl = d3.select(svgRef.current);

    createBaseMap(svgEl, world, projection);

    // Airports
    const airportGroup = svgEl.append("g").attr("id", "airports");
    const airport = airportGroup.selectAll("circle").data(airportsGeo);

    airport
      .enter()
      .append("circle")
      .attr("r", (d) => scale(d.properties.value))
      .attr("cx", (d) => projection(d.geometry.coordinates)[0])
      .attr("cy", (d) => projection(d.geometry.coordinates)[1])
      .attr("stroke", "red")
      .attr("fill", "red")
      .attr("fill-opacity", 0.2)
      .attr("text", (d) => d.properties.name + ": " + d.properties.value);
  }, []);

  const svgRef = useRef(null);
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Airports</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <Heading Tag={Headings.H1}>Airports</Heading>
          <svg ref={svgRef} width={1020} height={600} />
        </main>
      </div>
    </Layout>
  );
};

export default Airports;
