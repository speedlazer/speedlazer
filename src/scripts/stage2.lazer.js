import battleship from "./stage1/battleship.lazer";
import { droneWave } from "./stage1/drones.lazer";
import { playerShip } from "./playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

const stage2 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
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
  await setScenery("City.CoastStart");
  setBackground("City.Sunrise");
  //await text.fadeOut(2000);
  text.remove();
  exec(playerShip({ existing: true }));

  await exec(droneWave(5, "pattern2", 500));
  await exec(droneWave(5, "pattern1", 500));
  await exec(droneWave(5, "pattern1", 500));
  await exec(droneWave(5, "pattern1", 500));

  await exec(battleship);
};

export default stage2;
