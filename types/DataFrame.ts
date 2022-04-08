import { ColumnType } from "./Column";
import { Flight } from "./Flight";
import { Project } from "./Project";

export type DataFrame<T = Row> = {
  _data: Data<T>;
};

export type Data<T = Row> = T[];

export type Description = {
  columns: Column[];
  nColumns: number;
  nRows: number;
};

export type ProjectTable = DataFrame<Project>; // Project[] // Array<Project>
export type FlightsTable = DataFrame<Flight>;
export type SimpleTable = DataFrame;

export type Datum = string | number | Date | Object | string[] | null;

export type Row = {
  [key: string]: Datum;
};

export type Column = Array<Datum> & {
  label: string;
  type: ColumnType;
  stats: ColumnStats;
};

export type ColumnStats = {
  missing: number;
  mean?: number;
  median?: number;
  sd?: number;
};
