import React, { FC } from "react";
import styles from "../styles/Heading.module.scss";

export enum Headings {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}

type HeadingProps = React.PropsWithChildren<{
  Tag: Headings;
  className?: Headings;
}>;

const Heading: FC<HeadingProps> = ({ Tag, className, children }) => {
  return <Tag className={className && styles[className]}>{children}</Tag>;
};

export default Heading;
