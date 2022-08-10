import * as _ from "lodash";
import Column from "./Column";

export type Description = {
  columns: Column[];
  nColumns: number;
  nRows: number;
};

export type Datum = string | number | Date | Object | string[] | null;

interface BaseRow {
  [key: string]: any;
}

export type Row = {
  [key: string]: Datum;
};

export type Data<T = Row> = T[];

export type ColumnStats = {
  missing: number;
  mean?: number;
  median?: number;
  sd?: number;
};

class DataFrame<T extends BaseRow = Row> {
  private _data: Data<T>;

  constructor(data: any[]) {
    this._data = data;
  }

  get data(): Data<T> {
    return this._data;
  }

  set data(data: Data<T>) {
    this._data = data;
  }

  /**
   * Get all column names of the Dataframe.
   * @returns Returns an Array of strings.
   */
  getColumnNames(): string[] {
    return Object.keys(this.data[0]);
  }

  /**
   * Get all Columns of the Dataframe.
   * @returns Returns an Array of {@link Column}s.
   */
  getColumns(): Column[] {
    const sample = this.data[0];
    const cols = Object.keys(sample);
    return cols.map((columnName): Column => {
      return this.getColumn(columnName);
    });
  }

  /**
   * Gets a Description of the Dataframe.
   * @returns Returns an Object describing the Dataframe.
   */
  getDescription(): Description {
    const columns = this.getColumns();
    const nColumns = columns.length;
    const nRows = this.data.length;
    return {
      columns,
      nColumns,
      nRows,
    };
  }

  /**
   * Gets a specific column of the table.
   * @param columnName A string with the name of the {@link Column} to retrieve.
   * @returns Returns a {@link Column}.
   */
  getColumn(columnName: string): Column {
    const data = this.data.map((row) => row[columnName]);
    const column = new Column(data, columnName);
    return column;
  }

  /**
   * Rename a column of the Dataframe.
   * @param names An object with the old name of the column as key and the new name as value.
   * @returns A new {@link DataFrame} with the renamed column
   */
  renameColumn(names: { [oldColumnName: string]: string }): DataFrame<T> {
    let df = _.cloneDeep(this);
    const oldName = Object.keys(names)[0];
    const newName = Object.values(names)[0];
    return df
      .mutate(newName, (row) => {
        return row[oldName] ?? null;
      })
      .dropColumn(oldName);
  }

  // TODO: implement .between()
  /**
   * Gets a specific column of the table.
   * @param rowIndices
   * @returns Returns an Array of {@link Row}s.
   */
  between(rowIndices: number[]): T[] {
    return this.data.filter((row: T) => row);
  }

  // TODO: what happens if the new column already exists?
  /**
   * Adds a new column to the Dataframe.
   * @param columnName A string defining the name of the new Column.
   * @param transformFunction
   * @returns Returns a {@link DataFrame} including the just created column.
   */
  mutate(
    columnName: string,
    transformFunction: (t: any) => Datum
  ): DataFrame<T> {
    const df = _.cloneDeep(this);
    const data = df.data.map((row) => {
      row[columnName] = transformFunction(row);
      return row;
    });
    df.data = data;
    return df;
  }

  merge(dataframe: DataFrame<T>) {
    // TODO: implement warning if columnnames are not the same?
    return new DataFrame<T>([...this.toArray(), ...dataframe.toArray()]);
  }

  where(filterFunction: (t: any) => boolean) {
    const newData = this.data.filter((row) => filterFunction(row));
    return new DataFrame(newData);
  }

  /**
   * Create a new column and only keep this column in the Dataframe.
   * @param columnName The name of the new column.
   * @param transformFunction A function to creating the new column, using the row as callback.
   * @returns Returns a {@link DataFrame} with the just created column.
   */
  transmute(columnName: string, transformFunction: (t: any) => Datum) {
    const newRow = this.data.map(
      (row) => (row[columnName] = transformFunction(row))
    );
    return new DataFrame<T>(newRow);
  }

  /**
   * Drops an existing column from the table.
   * @param columnNames The column to drop. Either a string or an array of strings.
   * @returns A new {@link DataFrame}.
   */
  dropColumn(columnName: string): this;
  dropColumn(columnName: string[]): this;
  dropColumn(columnNames: string | string[]) {
    const toDrop =
      typeof columnNames === "string" ? [columnNames] : columnNames;
    const data = this.data.map((row: T) => {
      for (const columnName of toDrop) {
        delete row[columnName];
      }
      return row;
    });
    return new DataFrame(data);
  }

  // TODO: overload for string and string[]
  /**
   * Select specific columns of the Dataframe.
   * @param selection An array of columnnames.
   * @returns Returns a {@link DataFrame} containing the selected columns.
   */
  select(selection: string[]) {
    const df = _.cloneDeep(this);
    const columnNames = df
      .getDescription()
      .columns.map((column) => column.label);
    const toDrop = columnNames.reduce((toDrop: string[], columnName) => {
      if (!selection.includes(columnName)) toDrop.push(columnName);
      return toDrop;
    }, []);

    return df.dropColumn(toDrop);
  }

  /**
   * Converts the dataframe to an array of Rows.
   * @returns An array of {@link Row}s
   */
  toArray() {
    return this.data;
  }
}

export default DataFrame;
