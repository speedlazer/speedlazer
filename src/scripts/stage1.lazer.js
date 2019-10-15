//import battleship from "./stage1/battleship.lazer";
import { droneWave } from "./stage1/drones.lazer";
import { bigText } from "src/components/BigText";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  spawnShip,
  setWeapons,
  setBackground,
  setBackgroundCheckpointLimit,
  exec,
  wait
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);

  await setScrollingSpeed(100, 0);
  await setScenery("City.Ocean");
  setBackground("City.Sunrise");
  //await text.fadeOut(2000);
  text.remove();

  await spawnShip();
  await setWeapons(["lasers"]);
  await exec(droneWave(5, "pattern1", 1000));
  await wait(1000);
  setBackgroundCheckpointLimit(1);
  await exec(droneWave(5, "pattern1", 1000));
  await setScenery("City.CoastStart");
  await exec(droneWave(5, "pattern1", 1000));
  console.log("Done!");
};

export default stage1;
