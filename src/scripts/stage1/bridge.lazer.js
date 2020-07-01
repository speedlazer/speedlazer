import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { rocketStrike } from "./enemies/rockets.lazer";
import { largeDrone } from "./enemies/largeDrone.lazer";
import audio from "src/lib/audio";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  parallel,
  exec,
  waitTillInScreen,
  showHUD
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects", "hero"]);
  audio.playAudio("hero");

  await setScrollingSpeed(250, 0, { instant: true });
  await setScenery("city.BayFull");
  setBackground("city.Sunrise", 3, 3);
  showHUD();
  text.remove();
  exec(playerShip({ existing: true, hasLaser: true }));

  const warning = bigText("Warning!", { color: "#FF0000" });
  await warning.blink(500, 4);
  warning.remove();

  await setScenery("city.Bridge");
  await parallel([
    async () => {
      await waitTillInScreen("city.Bridge", -625);
      await setScrollingSpeed(0, 0);
    },
    async () => {
      await exec(rocketStrike());
      await exec(rocketStrike());
      await exec(rocketStrike());
    }
  ]);
  await exec(largeDrone());
};

export default part;
