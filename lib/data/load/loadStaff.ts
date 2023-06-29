import workbookFromXlsx from "../workbookFromXlsx";
import sheetToJson from "../sheetToJson";

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

export default async function loadStaff() {
  const filePath = "./data/itc/ITCHRDWH.xlsx";
  const workbook = await workbookFromXlsx(filePath);
  return sheetToJson<StaffRaw[]>(workbook.worksheets[0]);
}
