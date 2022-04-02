import { ProjectType } from "../../types/Project";

type TypeMapping = { [key: string]: ProjectType };

const mappedTypes: TypeMapping = {
  "Interne Reseach": ProjectType.Research,
  Integrated: ProjectType.Other,
  "Decentralization of Education": ProjectType.EducationAndTraining,
  "Education - Training": ProjectType.EducationAndTraining,
  "Seminar/Workshop/Symposium": ProjectType.EducationAndTraining,
  "10, 21 and 61": ProjectType.Other,
};

export default mappedTypes;
