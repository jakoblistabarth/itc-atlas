import React, { FC } from "react";
import styles from "../styles/tooltip.module.css";

type Props = React.PropsWithChildren<{
  raised?: boolean;
}>;

// TODO: use forward ref for floating-ui refs?
const Tooltip: FC<Props> = ({ raised, children, ...rest }) => {
  const classes = `${styles.tooltip} ${raised ? styles.raised : null}`;
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

export default Tooltip;
