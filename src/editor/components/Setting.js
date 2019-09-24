import { h } from "preact";
import style from "./setting.scss";

export const Setting = ({ checked, onCheck, children }) => (
  <label class={style.text}>
    <input
      type="checkbox"
      onChange={e => onCheck(e.target.checked)}
      checked={checked}
    />{" "}
    {children}
  </label>
);
