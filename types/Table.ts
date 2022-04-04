import { ColumnType } from "./Column";
import { Flight } from "./Flight";
import { Project } from "./Project";

export type Datum = string | number | Date | Object | string[] | null;

export type Row = {
  [key: string]: Datum;
};

export type Table<T = Row> = Array<T>;

export type Column = Array<Datum>;

export type ColumnStats = {
  missing: number;
  mean?: number;
  median?: number;
  sd?: number;
};

export type TableDescription = {
  columns: {
    label: string;
    type: ColumnType;
    stats: ColumnStats;
    data: Column;
  }[];
  nColumns: number;
  nRows: number;
};

export type ProjectTable = Table<Project>; // Project[] // Array<Project>
export type FlightsTable = Table<Flight>;
export type SimpleTable = Table;
