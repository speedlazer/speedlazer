import sun from "./Sun.entity.json";
import battleShip from "./BattleShip.entity.json";
import introShip from "./IntroShip.entity.json";
import playerShip from "./PlayerShip.entity.json";
import drone from "./Drone.entity.json";
import weapons from "./Weapons.entity.json";

export default {
  ...playerShip,
  ...battleShip,
  ...introShip,
  ...drone,
  ...sun,
  ...weapons
};
