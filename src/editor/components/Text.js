import { h } from "preact";
import style from "./Text.scss";

export const Text = ({ children }) => (
  <span class={style.text}>{children}</span>
);

export default Text;
