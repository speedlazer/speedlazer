import { h, Component } from "preact";
import { Menu } from "../../components/Menu";

import BattleShipCompositions from "src/components/entities/BattleShip.composition.json";
import DroneShipCompositions from "src/components/entities/DroneShip.composition.json";
import IntroShipCompositions from "src/components/entities/IntroShip.composition.json";

const compositions = [
  { name: "BattleShip", content: BattleShipCompositions },
  { name: "DroneShip", content: DroneShipCompositions },
  { name: "IntroShip", content: IntroShipCompositions }
];

class Compositions extends Component {
  render({ file }) {
    const activeFile =
      compositions.find(m => m.name === file) || compositions[0];

    return (
      <section>
        <h1 style={{ color: "white" }}> Compositions</h1>
        <Menu
          items={compositions.map(map => [
            map.name,
            `/compositions/${map.name}`
          ])}
        />
        <Menu
          items={Object.keys(activeFile.content).map(key => [
            key,
            `/compositions/${activeFile.name}/${key}`
          ])}
        />
      </section>
    );
  }
}

export default Compositions;
