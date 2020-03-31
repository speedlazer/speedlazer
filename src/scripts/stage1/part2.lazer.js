import { mineWave } from "./enemies/mines.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

const stage2 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  exec
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");

  await setScrollingSpeed(100, 0);
  setBackground("City.Sunrise");
  await setScenery("City.CoastStart");
  text.remove();
  exec(playerShip({ existing: true }));

  await exec(mineWave());
  await exec(mineWave());
  await exec(mineWave());
};

export default stage2;
