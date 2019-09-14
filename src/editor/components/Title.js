import { h } from "preact";
import style from "./Title.scss";

export const Title = ({ children }) => <h1 class={style.title}>{children}</h1>;

export default Title;
