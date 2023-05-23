export type ApplicationClean = {
  id: string;
  applicantId: string;
  applicantId_actual: string;
  programmId?: string;
  courseId: string;
  level?: string;
  statusId: string;
  examYear?: number;
  enrollmentStart?: Date;
  enrollmentEnd?: Date;
  enrolledDays?: number;
  certificationDate?: Date;
  sponsor: string;
  certificateType: string;
};
