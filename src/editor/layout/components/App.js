import { h } from "preact";
import { Menu } from "../../components/Menu";
import Router from "preact-router";
import Spritesheets from "src/editor/modules/spritesheets";

export const App = () => (
  <div>
    <Menu
      items={[["Sprites", "/sprites"], ["Composed entities", "/composed"]]}
    />
    <Router>
      <Spritesheets path="/editor/sprites/:map?" />
      <Spritesheets path="/editor/sprites/:map/:activeSprite" />
    </Router>
  </div>
);
