//import battleship from "./stage1/battleship.lazer";
import { droneWave1 } from "./stage1/drones.lazer";
import { bigText } from "src/components/BigText";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  spawnShip,
  setWeapons,
  exec
  //wait
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["city-enemies", "city-scenery"]);

  await setScrollingSpeed(300, 0);
  await setScenery("City.Ocean");
  await text.fadeOut(2000);
  text.remove();

  await spawnShip();
  await setWeapons(["lasers"]);
  await exec(droneWave1);
  //await wait(30000);
  //await exec(battleship);
};

export default stage1;
