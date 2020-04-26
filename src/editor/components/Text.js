import { h } from "preact";
import style from "./Text.scss";

export const Text = ({ label, children }) => (
  <span class={style.text}>
    {label} {children}
  </span>
);

export default Text;
