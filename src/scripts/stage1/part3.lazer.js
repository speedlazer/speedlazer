import { mineWave } from "./enemies/mines.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  setBackgroundCheckpoint,
  showHUD,
  exec
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");
  await setScrollingSpeed(250, 0, { instant: true });
  setBackground("City.Sunrise");
  setBackgroundCheckpoint(1);
  await setScenery("City.Coast");
  showHUD();
  text.remove();
  exec(playerShip({ existing: true }));

  await exec(mineWave());
  await exec(mineWave());
  await exec(mineWave());
};

export default part;
