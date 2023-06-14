import * as ExcelJS from "exceljs";

const workbookFromXlsx = async (filePath: string) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  return workbook;
};
export default workbookFromXlsx;
