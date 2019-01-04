import "@babel/polyfill";
import "./styles/editor.css";
import { h, render } from "preact";

render(
  <div id="foo">
    <span>Hello, world!</span>
    <button onClick={() => alert("hi!")}>Click Me</button>
  </div>,
  document.body
);
