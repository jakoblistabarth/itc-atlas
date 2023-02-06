import { FC } from "react";

type Props = React.PropsWithChildren<{
  highlight?: boolean;
}>;

const MyListElement: FC<Props> = ({ highlight = false, children }) => (
  <li style={{ fontWeight: highlight ? "bold" : "normal" }}>{children}</li>
);

export default MyListElement;
