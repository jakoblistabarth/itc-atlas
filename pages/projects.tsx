import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const Projects: NextPage = () => {
  useEffect(async () => {
    const res = await fetch("/api/data/projects");
    const projects = await res.json();

    const formatTime = d3.timeFormat("%B %d, %Y");

    const data = projects.filter((d) => d.dateStart && d.dateEnd);

    data.forEach((d) => {
      d.dateStart = new Date(d.dateStart);
      d.dateEnd = new Date(d.dateEnd);
    });

    data.sort((a, b) => d3.ascending(a.dateStart, b.dateStart));

    console.table(
      data
        // .filter((d) => d.countries.length >= 1)
        // .filter((d) => d.CountriesRegion === "The Netherlands")
        .map((d) => {
          return {
            original: d.CountriesRegion,
            countriesRegion: d.CountriesRegionArr,
            countries: d.countries,
            regions: d.regions,
            subRegion: d.subRegions,
            intermediateRegion: d.intermediateRegions,
          };
        })
    );

    // const count = d3
    //   .rollups(
    //     data,
    //     (v) => v.length,
    //     (d) => d.CountriesRegionMatch
    //   )
    //   .sort((a, b) => d3.descending(a[1], b[1]));
    // console.table(count);

    const margin = {
        top: 10,
        right: 30,
        bottom: 80,
        left: 250,
      },
      width = 1080 - margin.left - margin.right,
      height = 2000 - margin.top - margin.bottom;

    const svgEl = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3
      .scaleTime()
      .range([0, width])
      .domain([
        d3.min(data.map((d) => d.dateStart)),
        d3.max(data.map((d) => d.dateEnd)),
      ]);

    const y = d3
      .scalePoint()
      .range([0, height])
      .domain(data.map((d) => d.projectShortName))
      .padding(1);

    svgEl
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "center");

    svgEl.append("g").call(d3.axisLeft(y));

    // Lines
    svgEl
      .append("g")
      .attr("id", "lines")
      .selectAll("line")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (d) => x(d.dateStart))
      .attr("x2", (d) => x(d.dateEnd))
      .attr("y1", (d) => y(d.projectShortName))
      .attr("y2", (d) => y(d.projectShortName))
      .attr("stroke", (d) => (d.dateEnd < new Date() ? "black" : "lightgrey"))
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", "2px")
      .append("svg:title")
      .text(
        (d) =>
          d.projectShortName +
          " (" +
          formatTime(d.dateStart) +
          "-" +
          formatTime(d.dateEnd) +
          ")"
      );
  });

  const svgRef = useRef(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>Projects</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <main className={styles.main}>
        <h1>Projects</h1>
        <p>681 projects</p>
        <svg ref={svgRef} width={1080} height={2000} />
      </main>
    </div>
  );
};

export default Projects;
