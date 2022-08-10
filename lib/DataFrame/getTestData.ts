type TestRow = {
  name: string;
  nickname?: string;
  gender: "m" | "f" | "d" | null;
  height: number | null;
  dateOfBirth: string | null;
  luckyNumber: number | null;
  pinArray: number[] | null;
};

export default function getTestData(): TestRow[] {
  return [
    {
      name: "Ana",
      nickname: "A",
      gender: "f",
      height: null,
      dateOfBirth: new Date("1950-03-15").toISOString(),
      luckyNumber: 10000000,
      pinArray: [10, 20, 10],
    },
    {
      name: "John",
      nickname: "Joe",
      gender: "m",
      height: 130,
      dateOfBirth: new Date("1990-03-10").toISOString(),
      luckyNumber: 2,
      pinArray: null,
    },
    {
      name: "John",
      nickname: "Joe",
      gender: "m",
      height: 170,
      dateOfBirth: "",
      luckyNumber: 12,
      pinArray: null,
    },
    {
      name: "Jonas",
      nickname: "Joe",
      gender: "m",
      height: null,
      dateOfBirth: new Date("1992-02-12").toISOString(),
      luckyNumber: null,
      pinArray: [10, 20, 30],
    },
    {
      name: "Amely",
      nickname: "",
      gender: "d",
      height: 160,
      dateOfBirth: new Date("2000-10-10").toISOString(),
      luckyNumber: 2,
      pinArray: [10, 20, 30],
    },
    {
      name: "Astrid",
      nickname: "",
      gender: "f",
      height: 190,
      dateOfBirth: new Date("1990-03-10").toISOString(),
      luckyNumber: 33,
      pinArray: [3, 2, 1],
    },
  ];
}
