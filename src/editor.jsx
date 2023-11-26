import { h, render } from "preact";
import { App } from "./editor/layout/components/App";

/* eslint-env node */
if (process.env.APP_ENV === "development") {
  if (module.hot) {
    module.hot.decline();
  }
}

render(<App />, document.body);

