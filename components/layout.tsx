import { FC, ReactChildren } from "react";
import styles from "../styles/layout.module.css";
import PropTypes from "prop-types";

const Layout: FC<ReactChildren> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
