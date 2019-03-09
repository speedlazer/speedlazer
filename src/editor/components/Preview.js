import { h } from "preact";
import style from "./Preview.scss";

const Preview = ({ onMount }) => <div ref={onMount} class={style.preview} />;

export default Preview;
