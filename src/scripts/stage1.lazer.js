//import battleship from "./stage1/battleship.lazer";
import { droneWave } from "./stage1/drones.lazer";
import { bigText } from "src/components/BigText";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  spawnShip,
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

  setBackgroundCheckpointLimit(4);
  await exec(droneWave(5, "pattern1", 300));
  await wait(1000);
  await exec(droneWave(5, "pattern1", 300));
  await setScenery("City.CoastStart");
  await exec(droneWave(5, "pattern1", 300));
  console.log("Done!");
};

export default stage1;
