import styles from "../styles/summarytable.module.scss";
import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable";
import Heading, { Headings } from "./heading";
import { TableDescription } from "../types/Table";

type SummaryTableCardProps = {
  tableDescription: TableDescription;
};

const SummaryTableCard: FC<SummaryTableCardProps> = ({ tableDescription }) => {
  const ref = useRef();

  useEffect(() => {
    const svgElement = d3.select(ref.current);

    const theader = svgElement
      .append("g")
      .attr("id", "header")
      .selectAll("rect")
      .data(tableDescription.columns);

    const tbody = svgElement
      .append("g")
      .attr("id", "body")
      .selectAll("rect")
      .data(tableDescription.columns);

    theader
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 2 + i * 1)
      .attr("fill", (d) => colorMap.get(d.type).baseColor)
      .attr("width", 2)
      .attr("height", 50);
  });

  return (
    <div className={styles.summaryTableCard}>
      <Heading Tag={Headings.H3} className={Headings.H4}>
        Overview
      </Heading>
      <svg ref={ref} />
    </div>
  );
};

export default SummaryTableCard;
