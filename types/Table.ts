import { ColumnType } from "./Column";
import { Project } from "./Project";

export type Entity = string | number | Date | Object | string[] | null;

export type Row = {
  [key: string]: Entity;
};

export type Table = Array<Row | Project>; // Question: Better extending Table to explicitly type for ProjectTable?

export type Column = Array<Entity>;

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
