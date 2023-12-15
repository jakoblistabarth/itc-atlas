import loadProjects from "../load/loadProjects";
import * as aq from "arquero";

(async () => {
  const btors = await loadProjects();
  const tb = aq.from(btors);
  const count2 = tb
    .groupby("departmentsSecondary")
    .count()
    .orderby(aq.desc("count"))
    .objects();
  console.table(count2);
  const count1 = tb
    .groupby("departmentsMain")
    .count()
    .orderby(aq.desc("count"))
    .objects();
  console.table(count1);
  const departmentsSecondary = count2
    .map(
      //@ts-expect-error type conflict with arquero's(?) object
      (d: { departmentsSecondary: string[]; count: number }) =>
        d.departmentsSecondary,
    )
    .flat();
  console.log(new Set(departmentsSecondary));
})();
