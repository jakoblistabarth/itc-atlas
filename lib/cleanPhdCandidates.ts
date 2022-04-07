export function cleanPhdCandiates(phdCandidates: unknown[]) {
  phdCandidates.forEach((d) => (d.ITCStudentNo = d.ITCStudentNo + ""));
  phdCandidates.forEach(
    (d) => (d.PhDStart = d.PhDStart ? d.PhDStart.toISOString() : null)
  );
  phdCandidates.forEach(
    (d) => (d.PhDEnd = d.PhDEnd ? d.PhDEnd.toISOString() : null)
  );

  return phdCandidates.map(
    ({
      ITCStudentNo,
      Country,
      Department,
      DepartmentSecond,
      Sponsor,
      PhDStart,
      PhDEnd,
    }) => ({
      studentID: ITCStudentNo,
      country: Country,
      department1: Department,
      department2: DepartmentSecond,
      sponsor: Sponsor,
      startDate: PhDStart,
      endDate: PhDEnd,
    })
  );
}
