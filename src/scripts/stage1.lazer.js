import { droneWave } from "./stage1/drones.lazer";
import { playerShip } from "./playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  setBackgroundCheckpointLimit,
  playAnimation,
  exec
  //wait
}) => {
  window.Crafty = Crafty;
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");

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
};

export default stage1;
