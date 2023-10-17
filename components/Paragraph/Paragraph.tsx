import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;

const Paragraph: FC<Props> = ({ children }) => (
  <p className="mt-2 max-w-2xl text-justify">{children}</p>
);

export default Paragraph;
