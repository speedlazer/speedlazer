import * as styles from "./Divider.module.scss";

export const Divider = ({ children }) => (
  <div class={styles.divider}>{children}</div>
);
