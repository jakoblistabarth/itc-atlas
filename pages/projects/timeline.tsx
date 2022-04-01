import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import isPartOfUnsdGroup from "../../lib/isPartOfUnsdGroup";
import { Project } from "../api/data/projects";

const Timeline: NextPage = () => {
  useEffect(async () => {
    const res = await fetch("/api/data/projects");
    const projects: Project[] = await res.json();
    let data = projects.filter((d) => d.dateStart && d.dateEnd);

    const res2 = await fetch("/api/data/unsdcodes/countries");
    const countries = await res2.json();

    const formatTime = d3.timeFormat("%B %d, %Y");

    data.forEach((d) => {
      d.dateStart = new Date(d.dateStart);
      d.dateEnd = new Date(d.dateEnd);
    });

    data.sort((a, b) => d3.ascending(a.dateStart, b.dateStart));

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
      .domain(data.map((d) => d.projectID))
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
      .attr("y1", (d) => y(d.projectID))
      .attr("y2", (d) => y(d.projectID))
      .attr("stroke", (d) =>
        d.countries.some((e) => {
          return isPartOfUnsdGroup(countries, e, "LDC");
        })
          ? "red"
          : "black"
      )
      .attr("stroke-dasharray", (d) => (d.dateEnd < new Date() ? "none" : "1"))
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", (d) => (d.status === "Rejected" ? "10px" : "2px"))
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

export default Timeline;
