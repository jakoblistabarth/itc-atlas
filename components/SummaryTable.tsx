import { nanoid } from "nanoid";
import { FC } from "react";
import { BiBracket } from "react-icons/bi";
import {
  MdCalendarToday,
  MdClose,
  MdFormatListBulleted,
  MdOutlineCalculate,
} from "react-icons/md";
import DataFrame from "../lib/DataFrame/DataFrame";
import { fFloat, fPercentage } from "../lib/utilities/formaters";
import { colorMap } from "../lib/summarytable/colorMap";
import styles from "../styles/summarytable.module.scss";
import { ColumnType } from "../types/Column";
import SummaryTableCard from "./SummaryTableCard";
import Snapshot from "./Snapshot";

function getColumnIcon(type: ColumnType) {
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
}

type SummaryTableProps = {
  data: DataFrame;
};

const SummaryTable: FC<SummaryTableProps> = ({ data: df }) => {
  return (
    <div className={styles.summaryTableContainer}>
      <SummaryTableCard description={df.getDescription()} />
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
            {df.getColumns().map((column) => {
              // TODO: fix hydration error: calendar icon in first and last row??
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
                    <div className={styles.scrollable}>{column.label}</div>
                  </td>
                  <td>
                    <Snapshot
                      column={column}
                      columnName={column.label}
                      type={column.type}
                    />
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
  );
};

export default SummaryTable;
