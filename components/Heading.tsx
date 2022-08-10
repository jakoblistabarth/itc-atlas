import React, { FC } from "react";
import styles from "../styles/heading.module.css";

export enum Headings {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}

type Props = React.PropsWithChildren<{
  Tag: Headings;
  className?: Headings;
}>;

const Heading: FC<Props> = ({ Tag, className, children }) => {
  return <Tag className={className && styles[className]}>{children}</Tag>;
};

export default Heading;
