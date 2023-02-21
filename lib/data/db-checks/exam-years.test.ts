import * as aq from "arquero";
import xlsx from "xlsx";
import getApplicationsByYear from "../queries/application/getApplicationsByYear";
import { describe, test, expect, beforeAll } from "@jest/globals";
import ColumnTable from "arquero/dist/types/table/column-table";

type AlumniCount = { "Exam Year": number | null; count: number };

let countAlumniDB: AlumniCount[], countAlumni: ColumnTable;

beforeAll(async () => {
  countAlumniDB = (await getApplicationsByYear("IDN")).map((d) => ({
    "Exam Year": d.examYear,
    count: d._count._all,
  }));

  const filePath = "./data/itc/All Alumni until 2020_Anon_JMT.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const alumni = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });
  const tb2 = aq.from(alumni);
  countAlumni = tb2
    .filter((d: any) => d.Country === "Indonesia")
    .groupby("Exam Year")
    .count();
});

describe("Alumni numbers of database and Menno-Jan's spreadsheet match for Indonesia", () => {
  test("in 2013", async () => {
    expect(
      countAlumni.filter((d: any) => d["Exam Year"] === 2013).object()
    ).toStrictEqual(
      aq
        .from(countAlumniDB)
        .filter((d: any) => d["Exam Year"] === 2013)
        .object()
    );
  });

  //TODO: Fix or accept, as valid?
  test.failing("in 2020", async () => {
    expect(
      countAlumni.filter((d: any) => d["Exam Year"] === 2020).object()
    ).toStrictEqual(
      aq
        .from(countAlumniDB)
        .filter((d: any) => d["Exam Year"] === 2020)
        .object()
    );
  });
});
