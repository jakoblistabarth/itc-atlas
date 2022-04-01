export default async function getTestData() {
  return [
    {
      name: "John",
      height: 130,
      dateOfBirth: new Date("1990-03-10").toISOString(),
      favNo: 2,
      pinArray: null,
    },
    {
      name: "John",
      height: 170,
      dateOfBirth: "",
      favNo: 12,
      pinArray: null,
    },
    {
      name: "Ana",
      height: null,
      dateOfBirth: new Date("1990-03-15").toISOString(),
      favNo: null,
      pinArray: [10, 20, 30],
    },
    {
      name: "Jonas",
      height: null,
      dateOfBirth: new Date("1992-02-12").toISOString(),
      favNo: null,
      pinArray: [10, 20, 30],
    },
    {
      name: "Amely",
      height: null,
      dateOfBirth: new Date("1993-10-10").toISOString(),
      favNo: 2,
      pinArray: [10, 20, 30],
    },
  ];
}
