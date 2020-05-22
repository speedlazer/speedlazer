import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { rocketStrike } from "./enemies/rockets.lazer";
import { playAudio } from "src/lib/audio";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  parallel,
  wait,
  exec,
  waitTillInScreen,
  playAnimation,
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

  const warning = bigText("Warning!", { color: "#FF0000" });
  await warning.blink(500, 4);
  warning.remove();

  await setScenery("City.Bridge");
  await parallel([
    async () => {
      await waitTillInScreen("City.Bridge", -625);
      await setScrollingSpeed(0, 0);
    },
    async () => {
      await exec(rocketStrike());
      await exec(rocketStrike());
      await exec(rocketStrike());
    }
  ]);

  await wait(10e3);

  const bridgeCrash = playAnimation("City.Bridge", { max: 2 });
  await wait(10e3);

  bridgeCrash.updateCheckpointLimit(Infinity);
  await bridgeCrash.waitTillCheckpoint(3);
  await setScrollingSpeed(200, 0);

  await wait(20e3);
};

export default part;
