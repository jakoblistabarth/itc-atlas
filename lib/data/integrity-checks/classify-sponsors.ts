import { mapToSponsor } from "../../mappings/application.sponsor";
import loadContactsEnriched, {
  ContactEnriched,
} from "../load/loadContactsEnriched";
import * as aq from "arquero";

// Check classification of application sponsors
(async () => {
  const tb = aq.from(await loadContactsEnriched()).derive({
    sponsorGroup: aq.escape((d: ContactEnriched) => mapToSponsor(d.Sponsor)),
  });

  const groupedBySponsor = tb
    .groupby("Sponsor", "sponsorGroup")
    .count()
    .orderby("sponsorGroup", aq.desc("count"));

  console.table(groupedBySponsor.objects());
  console.table(
    tb.groupby("sponsorGroup").count().orderby(aq.desc("count")).objects()
  );

  console.table(
    tb.groupby("SponsorCategory").count().orderby(aq.desc("count")).objects()
  );
})();
