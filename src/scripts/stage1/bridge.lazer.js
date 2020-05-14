import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  wait,
  exec,
  waitTillInScreen,
  showHUD
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects", "hero"]);
  playAudio("hero");

  await setScrollingSpeed(250, 0, { instant: true });
  await setScenery("City.BayFull");
  setBackground("City.Sunrise", 3, 3);
  showHUD();
  text.remove();
  exec(playerShip({ existing: true }));

  await setScenery("City.Bridge");

  await waitTillInScreen("City.Bridge", -625);
  await setScrollingSpeed(0, 0);
  await wait(20e3);
};

export default part;
