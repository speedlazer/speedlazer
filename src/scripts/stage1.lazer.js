import battleship from "./stage1/battleship.lazer";
import { droneWave } from "./stage1/drones.lazer";
import { bigText } from "src/components/BigText";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  spawnShip,
  setBackground,
  setBackgroundCheckpointLimit,
  playAnimation,
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
  await playAnimation("City.Intro");

  await spawnShip("PlayerShip", { existing: true });

  setBackgroundCheckpointLimit(4);

  await setScrollingSpeed(150, 0);
  await playAnimation("City.Intro2");

  await exec(droneWave(5, "pattern1", 300));
  await wait(500);
  await exec(droneWave(5, "pattern1", 300));
  await wait(500);
  await exec(droneWave(5, "pattern1", 300));
  await wait(500);
  await exec(droneWave(5, "pattern1", 300));
  await wait(500);
  await exec(droneWave(5, "pattern1", 300));
  await wait(500);
  await exec(droneWave(5, "pattern1", 300));
  await setScenery("City.CoastStart");
  await exec(droneWave(5, "pattern1", 300));

  await exec(battleship);
  console.log("Done!");
};

export default stage1;
