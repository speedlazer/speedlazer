import "@babel/polyfill";
import "./styles/editor.css";
import { h, render } from "preact";
import { App } from "src/editor/layout/components/App";

render(<App />, document.body);
