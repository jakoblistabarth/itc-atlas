import ColumnTable from "arquero/dist/types/table/column-table";
import { FC } from "react";
import { BiBracket } from "react-icons/bi";
import {
  MdCalendarToday,
  MdClose,
  MdFormatListBulleted,
  MdOutlineCalculate,
} from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { fFloat, fPercentage } from "../../lib/utilities/formaters";
import Snapshot from "../Snapshot";
import {
  ColumnDataType,
  colorMap,
  getSummaryTableData,
} from "./SummaryTable.helpers";
import SummaryTableCard from "./SummaryTableCard";

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
      {title && <h2>{title}</h2>}
      <div className="grid grid-cols-[100px_auto] gap-x-5">
        <SummaryTableCard data={stdata} />
        <div>
          <table
            className="border-collapse text-sm"
            //TODO: add padding to rows/tds
          >
            <thead className="py text-left text-xs">
              <tr className="border-b border-gray-100">
                <th className="py-2 font-normal"></th>
                <th className="py-2 font-normal">Column</th>
                <th className="py-2 font-normal">Snapshot</th>
                <th className="py-2 font-normal">Missing</th>
                <th className="py-2 font-normal">Mean</th>
                <th className="py-2 font-normal">Median</th>
                <th className="py-2 font-normal">SD</th>
              </tr>
            </thead>
            <tbody>
              {stdata.map((column, idx) => {
                const color = colorMap.get(column.type);
                {
                  if (!color) return;
                }
                return (
                  <tr
                    key={`${column.name}-${idx}`}
                    className="border-b border-gray-100"
                  >
                    <td
                      className="border-l-4 border-blue-700 first-of-type:p-2"
                      style={{ borderColor: color.baseColor }}
                    >
                      {getColumnIcon(column.type)}
                    </td>
                    <td className="max-w-[160px]">
                      <div
                        className="scroll overflow-x-auto whitespace-nowrap"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {column.name}
                      </div>
                    </td>
                    <td>
                      <Snapshot column={column} />
                    </td>
                    <td
                      className={twMerge(
                        column.stats?.missing > 0.25 &&
                          "font-bold text-red-500",
                      )}
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
