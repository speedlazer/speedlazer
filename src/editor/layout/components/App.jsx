import { h } from "preact";
import { Menu } from "../../components/Menu";
import Router from "preact-router";
import Spritesheets from "../../modules/spritesheets";
import Audiosheets from "../../modules/audio";
import Compositions from "../../modules/compositions";
import Entities from "../../modules/entities";
import Sceneries from "../../modules/sceneries";
import Animations from "../../modules/animations";
import Paths from "../../modules/paths";
import Weapons from "../../modules/weapons";
import Particles from "../../modules/particles";
import Game from "../../modules/game";

export const App = () => (
  <div>
    <Menu
      horizontal={true}
      fullWidth={true}
      items={[
        ["Sprites", "/sprites"],
        ["Audio", "/audio"],
        ["Compositions", "/compositions"],
        ["Entities", "/entities"],
        ["Paths", "/paths"],
        ["Weapons", "/weapons"],
        ["Particles", "/particles"],
        ["Sceneries", "/sceneries"],
        ["Animations", "/animations"],
        ["Game", "/game"]
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
      <Game path="/editor/game/:stage?" />
    </Router>
  </div>
);
