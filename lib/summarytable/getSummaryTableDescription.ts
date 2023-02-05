import ColumnTable from "arquero/dist/types/table/column-table";

export type SummaryTableDescription = {
  columnNames: string[];
  nColumns: number;
  nRows: number;
};

const getSummaryTableDescription = (
  tb: ColumnTable
): SummaryTableDescription => ({
  columnNames: tb.columnNames(),
  nColumns: tb.numCols(),
  nRows: tb.totalRows(),
});

export default getSummaryTableDescription;
