import { ProjectStatus } from "@prisma/client";

const mapToProjectStatus = (string?: string) => {
  if (!string) return undefined;
  if (
    string.match(
      /EoI|LoI|MoU|Proposal|Invitation|Awaiting|submitted|Call|Offer|attempt/,
    )
  )
    return ProjectStatus.Proposed;
  if (string.match(/^(Rejected|Withdrawn)$/)) return ProjectStatus.Cancelled;
  if (string.match(/^(Finalized|Completed|Finished)$/))
    return ProjectStatus.Completed;
  if (string.match(/^(Ongoing|Approved|Awarded)$/)) return ProjectStatus.Ongoing;
  return undefined;
};

export default mapToProjectStatus;
