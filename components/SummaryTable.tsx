/** @jsxImportSource theme-ui */

import { nanoid } from "nanoid";
import { FC } from "react";
import { BiBracket } from "react-icons/bi";
import {
  MdCalendarToday,
  MdClose,
  MdFormatListBulleted,
  MdOutlineCalculate,
} from "react-icons/md";
import { fFloat, fPercentage } from "../lib/utilities/formaters";
import { colorMap } from "../lib/summarytable/colorMap";
import { ColumnDataType } from "../lib/summarytable/getColumnType";
import SummaryTableCard from "./SummaryTableCard";
import Snapshot from "./Snapshot";
import { Heading } from "theme-ui";
import ColumnTable from "arquero/dist/types/table/column-table";
import getSummaryTableData from "../lib/summarytable/getSummaryTableData";

const getColumnIcon = (type: ColumnDataType) => {
  switch (type) {
    case "ordinal":
      return <MdFormatListBulleted />;
    case "date":
      return <MdCalendarToday />;
    case "array":
      return <BiBracket />;
    default:
      return <MdOutlineCalculate />;
  }
};

type SummaryTableProps = {
  title?: string;
  data: ColumnTable;
};

const SummaryTable: FC<SummaryTableProps> = ({ data, title }) => {
  const stdata = getSummaryTableData(data);
  return (
    <>
      {title && <Heading as="h2">{title}</Heading>}
      <div
        sx={{
          display: "grid",
          gridTemplateColumns: "100px auto",
          columnGap: "4",
        }}
      >
        <SummaryTableCard data={stdata} />
        <div>
          <table
            sx={{
              fontSize: 1,
              borderCollapse: "collapse",
              "td:first-of-type": {
                padding: ".5em",
              },
              td: {
                padding: "0.5em 2em 0.5em 0",
                svg: {
                  display: "flex",
                },
              },
              tr: {
                borderBottom: "1px solid lightgrey",
              },
            }}
          >
            <thead
              sx={{
                fontSize: 0,
                fontWeight: "bold",
                textAlign: "left",
                th: {
                  py: 2,
                },
              }}
            >
              <tr>
                <th></th>
                <th>Column</th>
                <th>Snapshot</th>
                <th>Missing</th>
                <th>Mean</th>
                <th>Median</th>
                <th>SD</th>
              </tr>
            </thead>
            <tbody>
              {stdata.map((column) => {
                const color = colorMap.get(column.type);
                {
                  if (!color) return;
                }
                return (
                  <tr key={nanoid()}>
                    <td
                      sx={{
                        borderColor: color.baseColor,
                        borderLeftStyle: "solid",
                        borderLeftWidth: "3px",
                      }}
                    >
                      {getColumnIcon(column.type)}
                    </td>
                    <td sx={{ maxWidth: "160px" }}>
                      <div
                        sx={{
                          overflowX: "auto",
                          whiteSpace: "nowrap",
                          scrollbarWidth: "none",
                        }}
                      >
                        {column.name}
                      </div>
                    </td>
                    <td>
                      <Snapshot column={column} />
                    </td>
                    <td
                      sx={{
                        color: column.stats?.missing > 0.5 ? "red" : undefined,
                        fontWeight:
                          column.stats?.missing > 0.5 ? "bold" : undefined,
                      }}
                    >
                      {fPercentage(column.stats.missing)}
                    </td>
                    <td>
                      {typeof column.stats.mean === "number" ? (
                        fFloat(column.stats.mean)
                      ) : (
                        <MdClose color="lightgrey" />
                      )}
                    </td>
                    <td>
                      {typeof column.stats.median === "number" ? (
                        fFloat(column.stats.median)
                      ) : (
                        <MdClose color="lightgrey" />
                      )}
                    </td>
                    <td>
                      {typeof column.stats.sd === "number" ? (
                        fFloat(column.stats.sd)
                      ) : (
                        <MdClose color="lightgrey" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SummaryTable;
