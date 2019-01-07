import BattleShipCompositions from "src/components/entities/BattleShip.composition.json";
import DroneShipCompositions from "src/components/entities/DroneShip.composition.json";
import IntroShipCompositions from "src/components/entities/IntroShip.composition.json";

const compositions = [
  { name: "BattleShip", content: BattleShipCompositions },
  { name: "DroneShip", content: DroneShipCompositions },
  { name: "IntroShip", content: IntroShipCompositions }
];

export default compositions;
