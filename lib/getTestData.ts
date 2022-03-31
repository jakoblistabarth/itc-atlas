export default async function getTestData() {
  return [
    {
      name: "John",
      height: 130,
      dateOfBirth: new Date("1990-03-10"),
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
      height: 160,
      dateOfBirth: new Date("1990-03-15"),
      favNo: null,
      pinArray: [10, 20, 30],
    },
    {
      name: "Jonas",
      height: 150,
      dateOfBirth: new Date("1992-02-12"),
      favNo: null,
      pinArray: [10, 20, 30],
    },
    {
      name: "Amely",
      height: null,
      dateOfBirth: new Date("1993-10-10"),
      favNo: 2,
      pinArray: [10, 20, 30],
    },
  ];
}
