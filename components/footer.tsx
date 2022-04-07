import React, { FC } from "react";
import { monthFormat } from "../lib/formaters";
import styles from "../styles/home.module.css";

const Footer: FC = () => {
  return <footer className={styles.footer}>{monthFormat(new Date())}</footer>;
};

export default Footer;
