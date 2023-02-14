export type EmploymentClean = {
  mId: number;
  employmentStart: Date;
  employmentEnd: Date;
  employmentUnitEnd: Date;
  department?: string;
  type?: string;
  description?: string;
};
