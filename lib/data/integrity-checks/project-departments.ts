import loadBtors from "../load/loadProjects";
import * as aq from "arquero";

(async () => {
  const btors = await loadBtors();
  const tb = aq.from(btors);
  const count = tb
    .groupby("otherDepartments")
    .count()
    .orderby(aq.desc("count"))
    .objects();
  console.table(count);
  const otherDepartments = count
    .map(
      //@ts-expect-error type conflict with arquero's(?) object
      (d: { otherDepartments: string[]; count: number }) => d.otherDepartments,
    )
    .flat();
  console.log(new Set(otherDepartments));
})();
