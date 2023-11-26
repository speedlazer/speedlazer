import { h } from "preact";
import * as style from "./Text.module.css";

export const Text = ({ label, children }) => (
  <span class={style.text}>
    {label} {children}
  </span>
);

export default Text;
