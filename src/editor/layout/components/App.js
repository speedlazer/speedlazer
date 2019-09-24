import { h } from "preact";
import { Menu } from "../../components/Menu";
import Router from "preact-router";
import Spritesheets from "src/editor/modules/spritesheets";
import Compositions from "src/editor/modules/compositions";
import Entities from "src/editor/modules/entities";
import Sceneries from "src/editor/modules/sceneries";
import FlyPatterns from "src/editor/modules/fly-patterns";

export const App = () => (
  <div>
    <Menu
      horizontal={true}
      items={[
        ["Sprites", "/sprites"],
        ["Compositions", "/compositions"],
        ["Entities", "/entities"],
        ["Sceneries", "/sceneries"],
        ["Fly patterns", "/fly-patterns"]
      ]}
    />
    <Router>
      <Spritesheets path="/editor/sprites/:map?" />
      <Spritesheets path="/editor/sprites/:map/:activeSprite" />
      <Compositions path="/editor/compositions/:compositionName?" />
      <Compositions path="/editor/compositions/:compositionName/frames/:frameName" />
      <Entities path="/editor/entities/:entity?" />
      <Entities path="/editor/entities/:entity/states/:stateName/:habitatName" />
      <Sceneries path="/editor/sceneries/:scenery?" />
      <FlyPatterns path="/editor/fly-patterns/:pattern?" />
    </Router>
  </div>
);
