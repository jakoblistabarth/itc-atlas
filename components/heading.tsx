import React, { FC } from "react";
import PropTypes from "prop-types";
import styles from "../styles/heading.module.scss";

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

Heading.propTypes = {
  Tag: PropTypes.oneOf<Headings>([
    Headings.H1,
    Headings.H2,
    Headings.H3,
    Headings.H4,
    Headings.H5,
    Headings.H6,
  ]).isRequired,
  className: PropTypes.oneOf<Headings>([
    Headings.H1,
    Headings.H2,
    Headings.H3,
    Headings.H4,
    Headings.H5,
    Headings.H6,
  ]),
  children: PropTypes.node.isRequired,
};

export default Heading;
