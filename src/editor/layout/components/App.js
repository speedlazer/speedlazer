import { h } from "preact";
import { Menu } from "../../components/Menu";
import Router from "preact-router";
import Spritesheets from "src/editor/modules/spritesheets";
import Audiosheets from "src/editor/modules/audio";
import Compositions from "src/editor/modules/compositions";
import Entities from "src/editor/modules/entities";
import Sceneries from "src/editor/modules/sceneries";
import Animations from "src/editor/modules/animations";
import Paths from "src/editor/modules/paths";
import Weapons from "src/editor/modules/weapons";
import Particles from "src/editor/modules/particles";

export const App = () => (
  <div>
    <Menu
      horizontal={true}
      items={[
        ["Sprites", "/sprites"],
        ["Audio", "/audio"],
        ["Compositions", "/compositions"],
        ["Paths", "/paths"],
        ["Weapons", "/weapons"],
        ["Particles", "/particles"],
        ["Animations", "/animations"],
        ["Sceneries", "/sceneries"],
        ["Entities", "/entities"]
      ]}
    />
    <Router>
      <Spritesheets path="/editor/sprites/:map?" />
      <Spritesheets path="/editor/sprites/:map/:activeSprite" />
      <Audiosheets path="/editor/audio" />
      <Audiosheets path="/editor/audio/:map/:activeSample" />
      <Compositions path="/editor/compositions/:compositionName?" />
      <Compositions path="/editor/compositions/:compositionName/frames/:frameName" />
      <Compositions path="/editor/compositions/:compositionName/animations/:animationName" />
      <Entities path="/editor/entities/:entity?" />
      <Entities path="/editor/entities/:entity/states/:stateName/:habitatName" />
      <Sceneries path="/editor/sceneries/:scenery?" />
      <Animations path="/editor/animations/:animation?" />
      <Animations path="/editor/animations/:animation/checkpoints/:checkpoint" />
      <Paths path="/editor/paths/:pattern?" />
      <Weapons path="/editor/weapons/:weapon?" />
      <Particles path="/editor/particles/:particles?" />
    </Router>
  </div>
);
