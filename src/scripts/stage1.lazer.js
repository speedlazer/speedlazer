import battleship from "./stage1/battleship.lazer";
import { droneWave } from "./stage1/drones.lazer";
import { playerShip } from "./playerShip.lazer";
import { bigText } from "src/components/BigText";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  setBackground,
  setBackgroundCheckpointLimit,
  playAnimation,
  exec
  //wait
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);

  await setScrollingSpeed(100, 0);
  await setScenery("City.Ocean");
  setBackground("City.Sunrise");
  //await text.fadeOut(2000);
  text.remove();
  await playAnimation("City.Intro");

  exec(playerShip({ existing: true }));
  setBackgroundCheckpointLimit(4);

  await setScrollingSpeed(250, 0);
  await playAnimation("City.Intro2");

  await exec(droneWave(5, "pattern1", 500));
  await exec(droneWave(8, "pattern2", 500));
  await exec(droneWave(5, "pattern1", 500));
  await exec(droneWave(5, "pattern2", 500));
  await exec(droneWave(5, "pattern1", 500));
  await exec(droneWave(5, "pattern1", 500));
  await setScenery("City.CoastStart");
  await exec(droneWave(5, "pattern1", 500));

  await exec(battleship);
  console.log("Done!");
};

export default stage1;
