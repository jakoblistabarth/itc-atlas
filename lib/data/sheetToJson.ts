import { range } from "lodash";
import * as ExcelJS from "exceljs";

const sheetToJson = <T>(worksheet: ExcelJS.Worksheet): T => {
  const rows = worksheet.getRows(1, worksheet.actualRowCount);
  const columnCount = worksheet.actualColumnCount;
  const values =
    rows &&
    rows.map((row) =>
      range(columnCount).map((column) => row.getCell(column + 1).value)
    );
  if (!values) throw new Error("sheet cannot be parsed");
  const columnNames = values[0] as string[];
  // TODO: fix typing – with function overload or optional types?
  // @ts-expect-error generic type T could be instantiad arbitrarily
  return values.slice(1).map((row) =>
    row.reduce(
      (acc: { [key: string]: ExcelJS.CellValue }, cellValue, idx) => ({
        ...acc,
        [columnNames[idx]]: cellValue,
      }),
      {}
    )
  );
};
export default sheetToJson;
