//import battleship from "./stage1/battleship.lazer";
import { droneWave1 } from "./stage1/drones.lazer";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  spawnShip,
  setWeapons,
  exec
  //wait
}) => {
  await loadSpriteSheets(["city-enemies", "city-scenery"]);

  await setScrollingSpeed(300, 0);
  await setScenery("City.Ocean");
  await spawnShip();
  await setWeapons(["lasers"]);
  await exec(droneWave1);
  //await wait(30000);
  //await exec(battleship);
};

export default stage1;
