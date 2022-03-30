export type ProjectType =
  | "Education and Training"
  | "Consulting"
  | "Contract Education"
  | "Contract Research"
  | "Other"
  | "Research";

type TypeMapping = { [key: string]: ProjectType };

const mappedTypes: TypeMapping = {
  "Interne Reseach": "Research",
  Integrated: "Other",
  "Decentralization of Education": "Education and Training",
  "Education - Training": "Education and Training",
  "Seminar/Workshop/Symposium": "Education and Training",
  "10, 21 and 61": "Other",
};

export default mappedTypes;
