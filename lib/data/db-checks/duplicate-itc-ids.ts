import getPhdCandidates from "../load/loadPhdCandidates";

(async () => {
  const phdData = await getPhdCandidates();
  const counts: any = {};
  const phdIds = phdData
    .filter((d) => d.itcStudentId)
    .map((d) => d.itcStudentId ?? "");
  for (const num of phdIds) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  // print itcStudentIds which occure more than once in the phd cadndiate data
  console.log(
    Object.entries(counts)
      .map(([k, v]) => ({ itcStudentId: k, count: v as number }))
      .filter((d) => d.count > 1)
  );
})();
