export type EmploymentClean = {
  mId: number;
  employmentStart: Date;
  employmentEnd: Date;
  employmentUnitEnd: Date;
  organisation?: string;
  department?: string;
  type?: string;
  description?: string;
};
