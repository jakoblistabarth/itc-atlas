import styles from "../styles/summarytable.module.css";
import { FC } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable/colorMap";
import Heading, { Headings } from "./Heading";
import { fInt } from "../lib/utilities/formaters";
import { nanoid } from "nanoid";
import { SummaryTableData } from "../lib/summarytable/getSummaryTableData";

type SummaryTableCardProps = {
  data: SummaryTableData;
};

const SummaryTableCard: FC<SummaryTableCardProps> = ({ data }) => {
  const fontSize = 9;
  const dimension = {
    width: 100,
    height: 75,
    margin: {
      top: 15,
      left: 15,
    },
  };
  const headerHeight = 10;

  const scale = d3
    .scaleBand()
    .domain(data.columnNames)
    .rangeRound([0, dimension.width - dimension.margin.left])
    .paddingInner(0.1)
    .paddingOuter(0)
    .align(0)
    .round(true);

  return (
    <div className={styles.summaryTableCard}>
      <Heading Tag={Headings.H3} className={Headings.H5}>
        Dimensions
      </Heading>
      <svg>
        <g className="labels" fontSize={fontSize}>
          <text x={dimension.margin.left} y={fontSize}>
            {fInt(data.nColumns) + " ⭢"}
          </text>
          <text
            y={dimension.margin.top + fontSize / 2 + headerHeight + 1}
            transform={`rotate(90,${fontSize / 2},${
              dimension.margin.top + fontSize / 2 + headerHeight + 1
            })`}
          >
            {fInt(data.nRows) + " ⭢"}
          </text>
        </g>
        <g
          className="miniTable"
          transform={`translate(${dimension.margin.left},${dimension.margin.top})`}
        >
          <g>
            {data.map((column) => (
              <g className="column" key={nanoid()}>
                <rect
                  y={0}
                  x={scale(column.name)}
                  fill={colorMap.get(column.type)?.baseColor ?? "grey"}
                  width={scale.bandwidth()}
                  height={headerHeight}
                />
                <rect
                  y={headerHeight + 1}
                  x={scale(column.name)}
                  fill={colorMap.get(column.type)?.baseColor ?? "grey"}
                  width={scale.bandwidth()}
                  fillOpacity={0.3}
                  height={dimension.height - headerHeight - 1}
                />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default SummaryTableCard;
