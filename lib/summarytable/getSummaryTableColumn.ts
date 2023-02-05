import ColumnTable from "arquero/dist/types/table/column-table";
import getSummaryTableColumnDescription from "./getSummaryTableColumnDescription";

export type SummaryTableColumn = ReturnType<typeof getSummaryTableColumn>;

const getSummaryTableColumn = (tb: ColumnTable, name: string) => {
  const data = tb.array(name);
  const { type, stats } = getSummaryTableColumnDescription(data);
  return { data, name, type, stats };
};

export default getSummaryTableColumn;
