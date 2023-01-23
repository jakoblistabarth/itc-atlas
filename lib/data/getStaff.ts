import xlsx from "xlsx";
import cleanStaff from "./cleanStaff";

export type StaffRaw = {
  "M-Nr": number;
  Medewerker: string;
  Organisatiecode?: string;
  "Organisatienaam Eng": string;
  "Leerstoel / afdeling"?: string;
  Nationaliteit?: string;
  "Indicator Buitenlander": string;
  Geslacht: string;
  "Gepromoveerd (J/N)": string;
  Geboortedatum?: Date;
  "Som Fte Feitelijk": number;
  "Som Fte Formeel": number;
  "Begin Datum Aanstelling": Date;
  "Einddatum Aanstelling": Date;
  "Datum Einde dienstverband Eenheid": Date;
  "Soort Aanstelling": string;
  "Code Dienstverband": string;
  "Soort Medewerker"?: string;
  "Functie Code": string;
  "Functie Oms": string;
  Functiecategorie: string;
  "Functieprofiel Code": string;
  "Functieprofiel Omschrijving"?: string;
  "Aantal Tenure tracks": number;
};

export type StaffClean = {
  mId: number;
  dateOfBirth?: Date;
  employmentStart: Date;
  employmentEnd: Date;
  employmentUnitEnd: Date;
  gender: string;
  nationality?: string;
  organisation?: string;
  department?: string;
  type?: string;
  description?: string;
};

export default async function getStaff() {
  const filePath = "./data/itc/ITCHRDWH.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  }) as StaffRaw[];

  return await cleanStaff(data);
}
