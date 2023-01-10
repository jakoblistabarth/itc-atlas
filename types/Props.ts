import { Country } from "@prisma/client";
import { NeCountriesTopoJson } from "./NeTopoJson";

export type SharedPageProps = {
  neCountriesTopoJson: NeCountriesTopoJson;
  countries: Country[];
};
