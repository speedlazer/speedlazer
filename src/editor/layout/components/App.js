import { h } from "preact";
import { Menu } from "../../components/Menu";
import Router from "preact-router";
import Spritesheets from "src/editor/modules/spritesheets";
import Compositions from "src/editor/modules/compositions";

export const App = () => (
  <div>
    <Menu
      items={[["Sprites", "/sprites"], ["Composed entities", "/compositions"]]}
    />
    <Router>
      <Spritesheets path="/editor/sprites/:map?" />
      <Spritesheets path="/editor/sprites/:map/:activeSprite" />
      <Compositions path="/editor/compositions/:file?" />
      <Compositions path="/editor/compositions/:file/:compositionName" />
    </Router>
  </div>
);
