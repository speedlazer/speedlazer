import { h } from "preact"
import * as style from "./Title.module.scss";

export const Title = ({ children }) => <h1 class={style.title}>{children}</h1>;

export default Title;
