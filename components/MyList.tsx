import { FC } from "react";

type Props = React.PropsWithChildren<{
  background?: boolean;
}>;

const ListElement: FC<Props> = ({ background, children }) => (
  <ol style={{ background: background ? "lightblue" : "none" }}>{children}</ol>
);

export default ListElement;
