import { Table } from "../types/Table";

export default async function getTestData(): Promise<Table> {
  return [
    {
      name: "Ana",
      nickname: "A",
      height: null,
      dateOfBirth: new Date("1990-03-15").toISOString(),
      favNo: null,
      pinArray: [10, 20, 30],
    },
    {
      name: "John",
      nickname: "Joe",
      height: 130,
      dateOfBirth: new Date("1990-03-10").toISOString(),
      favNo: 2,
      pinArray: null,
    },
    {
      name: "John",
      nickname: "Joe",
      height: 170,
      dateOfBirth: "",
      favNo: 12,
      pinArray: null,
    },
    {
      name: "Jonas",
      nickname: "Joe",
      height: null,
      dateOfBirth: new Date("1992-02-12").toISOString(),
      favNo: null,
      pinArray: [10, 20, 30],
    },
    {
      name: "Amely",
      nickname: "",
      height: null,
      dateOfBirth: new Date("1993-10-10").toISOString(),
      favNo: 2,
      pinArray: [10, 20, 30],
    },
  ];
}
