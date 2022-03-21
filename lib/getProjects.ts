import xlsx from "xlsx";

export default async function getProjects() {
  const filePath = "./data/ITCProjects.xlsx";
  const file = xlsx.readFile(filePath);
  const SheetNames = file.SheetNames;
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    raw: false,
  });

  console.log(SheetNames);

  const flights = data
    .filter((d) => d["Sales Type"] !== "Train")
    .filter((d) => d.Route);
  flights.forEach((d) => {
    d.airportCodes = d.Route.split("-");
  });

  return {
    data: data,
  };
}
