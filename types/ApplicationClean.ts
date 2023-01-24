export type ApplicationClean = {
  id: string;
  applicantId: string;
  programmId?: string;
  courseId: string;
  level?: string;
  statusId: string;
  diplomaType?: string;
  departmentId?: string;
  enrollmentStart: Date;
  enrollmentEnd: Date;
  certificationDate: Date;
  sponsor: string;
  certificateType: string;
};
