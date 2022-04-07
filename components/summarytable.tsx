import { nanoid } from "nanoid";
import { FC } from "react";
import { BiBracket } from "react-icons/bi";
import {
  MdCalendarToday,
  MdClose,
  MdFormatListBulleted,
  MdOutlineCalculate,
} from "react-icons/md";
import { floatFormat, pctFormat } from "../lib/formaters";
import getTableDescription, { colorMap } from "../lib/summarytable";
import styles from "../styles/summarytable.module.scss";
import { ColumnType } from "../types/Column";
import { Table } from "../types/Table";
import Snapshot from "./snapshot";
import SummaryTableCard from "./summaryTableCard";

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
  table: Table;
};

const SummaryTable: FC<SummaryTableProps> = ({ table }) => {
  const tableDescription = getTableDescription(table);

  return (
    <div className={styles.summaryTableContainer}>
      <SummaryTableCard tableDescription={tableDescription} />
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
            {tableDescription.columns.map((column) => {
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
                      column={column.data}
                      columnName={column.label}
                      type={column.type}
                    />
                  </td>
                  <td
                    className={
                      column.stats?.missing > 0.5 ? styles.alert : undefined
                    }
                  >
                    {pctFormat(column.stats.missing)}
                  </td>
                  <td>
                    {typeof column.stats.mean === "number" ? (
                      floatFormat(column.stats.mean)
                    ) : (
                      <MdClose color="lightgrey" />
                    )}
                  </td>
                  <td>
                    {typeof column.stats.median === "number" ? (
                      floatFormat(column.stats.median)
                    ) : (
                      <MdClose color="lightgrey" />
                    )}
                  </td>
                  <td>
                    {typeof column.stats.sd === "number" ? (
                      floatFormat(column.stats.sd)
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
