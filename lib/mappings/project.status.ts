import { ProjectStatus } from "../../types/Project";

type StatusMapping = { [key: string]: ProjectStatus };

const type: StatusMapping = {
  Rejected: ProjectStatus.Undone,
  Awarded: ProjectStatus.Undone,
  Finalized: ProjectStatus.Completed,
  Complete: ProjectStatus.Completed,
  Ongoing: ProjectStatus.Ongoing,
  Finished: ProjectStatus.Completed,
  "Proposal submitted": ProjectStatus.Undone,
  Proposal: ProjectStatus.Undone,
  Invitation: ProjectStatus.Undone,
  "Awaiting contract": ProjectStatus.Undone,
  "Tender submitted": ProjectStatus.Undone,
  "LoI submitted": ProjectStatus.Undone,
  Approved: ProjectStatus.Undone,
};

export default type;
