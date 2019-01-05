import { h } from "preact";
import styles from "./Divider.scss";

export const Divider = ({ children }) => (
  <div class={styles.divider}>{children}</div>
);
