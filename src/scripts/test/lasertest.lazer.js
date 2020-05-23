import { bigText } from "src/components/BigText";
import { playerShip } from "../playerShip.lazer";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  showHUD,
  wait,
  exec
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects"]);
  await setScrollingSpeed(0, 0, { instant: true });
  await setScenery("Test.Walls");
  showHUD();
  text.remove();
  exec(playerShip({ existing: true, hasLaser: true }));
  await wait(5 * 60e3);
};

export default part;
