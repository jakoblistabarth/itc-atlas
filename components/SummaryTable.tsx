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
import styles from "../styles/summarytable.module.css";
import { ColumnDataType } from "../lib/summarytable/getColumnType";
import SummaryTableCard from "./SummaryTableCard";
import Snapshot from "./Snapshot";
import Heading, { Headings } from "./Heading";
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
      {title && <Heading Tag={Headings.H2}>{title}</Heading>}
      <div className={styles.summaryTableContainer}>
        <SummaryTableCard data={stdata} />
        <div className={styles.summaryTable}>
          <table>
            <thead>
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
                      className={styles.icon}
                      style={{ borderColor: color.baseColor }}
                    >
                      {getColumnIcon(column.type)}
                    </td>
                    <td className={styles.label}>
                      <div className={styles.scrollable}>{column.name}</div>
                    </td>
                    <td>
                      <Snapshot column={column} />
                    </td>
                    <td
                      className={
                        column.stats?.missing > 0.5 ? styles.alert : undefined
                      }
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
