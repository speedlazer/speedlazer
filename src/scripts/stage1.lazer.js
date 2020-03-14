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
  showHUD,
  exec,
  wait
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
  text.remove();
  const introAnimation = playAnimation("City.Intro");
  await introAnimation.waitTillCheckpoint(3);
  showHUD();
  const ready = bigText("Get ready", { color: "#FF0000" });
  const blink = ready.blink(200, 4);

  exec(playerShip({ existing: true }));
  setBackgroundCheckpointLimit(4);

  await setScrollingSpeed(250, 0);
  const droneAttacks = async () => {
    await blink;
    await ready.zoomOut(500);
    ready.remove();
    await wait(900);
    await exec(droneWave(5, "pattern1", 500));
    await exec(droneWave(8, "pattern2", 500));
    await exec(droneWave(5, "pattern1", 500));
  };
  await Promise.all([introAnimation.waitTillEnd(), droneAttacks()]);
  introAnimation.destroy();
};

export default stage1;
