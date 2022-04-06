import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import { useEffect, useRef } from "react";
import { geoBertin1953 } from "d3-geo-projection";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { geoPath } from "d3-geo";
import { Project } from "../../types/Project";
import getCountries from "../../lib/getCountries";
import getProjects from "../../lib/getProjects";
import BaseMap from "../../components/map/BaseMap";
import Heading, { Headings } from "../../components/heading";

type SiteProps = {
  projects: Project[];
  world: Awaited<ReturnType<typeof getCountries>>;
};

const ProjectCountries: NextPage<SiteProps> = ({ projects, world }) => {
  const count = d3
    .rollups(
      projects.reduce((acc: [], proj) => {
        acc.push(...proj.countries); // or proj.allCountries
        return acc;
      }, []),
      (v) => v.length,
      (d) => d
    )
    .sort((a, b) => d3.descending(a[1], b[1]));

  const projectsCountry = new Map(count);
  const maxRadius = 30;
  const minRadius = 1;

  world.objects.countries.geometries.forEach(
    (d) => (d.properties.value = projectsCountry.get(d.properties.iso3code))
  );

  const scale = d3
    .scaleSqrt()
    .domain(d3.extent(Array.from(projectsCountry.values())))
    .range([minRadius, maxRadius]);

  const margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    width = 1080 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  const projection = geoBertin1953();
  const path = geoPath().projection(projection);

  useEffect(async () => {
    const svgEl = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const symbols = svgEl.append("g").attr("id", "symbols");

    const symbol = symbols
      .selectAll("circle")
      .data(topojson.feature(world, world.objects.countries).features);

    symbol
      .enter()
      .append("circle")
      .attr("cx", (d) => path.centroid(d)[0])
      .attr("cy", (d) => path.centroid(d)[1])
      .attr("r", (d) => scale(d.properties.value))
      .attr("fill-opacity", 0.25)
      .attr("stroke-width", 0.5)
      .attr("stroke", "black")
      .append("svg:title")
      .text(
        (d) =>
          d.properties.name +
          " " +
          d.properties.iso3code +
          " " +
          d.properties.value
      );
  });

  const svgRef = useRef(null);

  return (
    <>
      <Head>
        <title>Projects per Country</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Projects per Country</Heading>
        <svg ref={svgRef} width={1020} height={2000}>
          <BaseMap baseMapData={world} projection={projection} />
        </svg>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<SiteProps> = async () => {
  const projects = await getProjects();
  const projectionSelection = projects.filter(
    (
      row
    ): row is Omit<Project, "dateStart" | "dateEnd" | "projectID"> & {
      dateStart: string;
      dateEnd: string;
      projectID: string;
    } => typeof row.dateStart !== "string" && typeof row.dateEnd !== "string"
  );

  projectionSelection.sort((a, b) =>
    d3.ascending(new Date(a.dateStart), new Date(b.dateStart))
  );

  const world = await getCountries();

  return {
    props: {
      projects: projectionSelection,
      world,
    },
  };
};

export default ProjectCountries;
