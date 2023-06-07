import { mapToOrganizationGroup } from "../../mappings/organizationGroup";
import { ProjectClean } from "../clean/cleanProjects";
import loadProjects from "../load/loadProjects";
import * as aq from "arquero";

// Check classification of project organizations
(async () => {
  const tb = aq.from(await loadProjects()).derive({
    leadOrganizationGroup: aq.escape((d: ProjectClean) =>
      mapToOrganizationGroup(d.leadOrganization)
    ),
    fundingOrganizationGroup: aq.escape((d: ProjectClean) =>
      mapToOrganizationGroup(d.fundingOrganization)
    ),
  });

  tb.groupby("leadOrganization", "leadOrganizationGroup")
    .count()
    .orderby("leadOrganizationGroup", aq.desc("count"))
    .print({ limit: 200 });
  tb.groupby("leadOrganizationGroup").count().orderby(aq.desc("count")).print();

  tb.groupby("fundingOrganization", "fundingOrganizationGroup")
    .count()
    .orderby("fundingOrganizationGroup", aq.desc("count"))
    .print({ limit: 200 });
  tb.groupby("fundingOrganizationGroup")
    .count()
    .orderby(aq.desc("count"))
    .print();
})();
