import { h } from "preact";
import { Menu } from "../../components/Menu";
import Router from "preact-router";
import Spritesheets from "src/editor/modules/spritesheets";
import Compositions from "src/editor/modules/compositions";
import Entities from "src/editor/modules/entities";
import Sceneries from "src/editor/modules/sceneries";
import Backgrounds from "src/editor/modules/backgrounds";
import Paths from "src/editor/modules/paths";
import Patterns from "src/editor/modules/patterns";

export const App = () => (
  <div>
    <Menu
      horizontal={true}
      items={[
        ["Sprites", "/sprites"],
        ["Compositions", "/compositions"],
        ["Paths", "/paths"],
        ["Patterns", "/patterns"],
        ["Backgrounds", "/backgrounds"],
        ["Sceneries", "/sceneries"],
        ["Entities", "/entities"]
      ]}
    />
    <Router>
      <Spritesheets path="/editor/sprites/:map?" />
      <Spritesheets path="/editor/sprites/:map/:activeSprite" />
      <Compositions path="/editor/compositions/:compositionName?" />
      <Compositions path="/editor/compositions/:compositionName/frames/:frameName" />
      <Compositions path="/editor/compositions/:compositionName/animations/:animationName" />
      <Entities path="/editor/entities/:entity?" />
      <Entities path="/editor/entities/:entity/states/:stateName/:habitatName" />
      <Sceneries path="/editor/sceneries/:scenery?" />
      <Backgrounds path="/editor/backgrounds/:background?" />
      <Backgrounds path="/editor/backgrounds/:background/checkpoints/:checkpoint" />
      <Paths path="/editor/paths/:pattern?" />
      <Patterns path="/editor/patterns/:pattern?" />
    </Router>
  </div>
);
