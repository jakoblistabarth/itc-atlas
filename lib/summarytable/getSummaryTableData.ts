import ColumnTable from "arquero/dist/types/table/column-table";
import getSummaryTableColumn, {
  SummaryTableColumn,
} from "./getSummaryTableColumn";
import getSummaryTableDescription from "./getSummaryTableDescription";

export type SummaryTableData = SummaryTableColumn[] &
  ReturnType<typeof getSummaryTableDescription>;

const getSummaryTableData = (tb: ColumnTable): SummaryTableData => {
  const columns = tb
    .columnNames()
    .map((name) => getSummaryTableColumn(tb, name));
  const tableDescription = getSummaryTableDescription(tb);
  return Object.assign(columns, { ...tableDescription });
};

export default getSummaryTableData;
