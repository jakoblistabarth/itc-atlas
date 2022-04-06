import React, { FC } from "react";
import { MonthFormat } from "../lib/formaters";
import styles from "../styles/home.module.css";

const Footer: FC = () => {
  return <footer className={styles.footer}>{MonthFormat(new Date())}</footer>;
};

export default Footer;
