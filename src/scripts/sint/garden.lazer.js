import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { checkpoint } from "../common.lazer";
import { jinte } from "./jinte.lazer";
import { birdWave } from "./enemies/birds.lazer";
import { fishWave } from "./enemies/fish.lazer";

export const garden = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  playAnimation,
  setAltitude,
  showHUD,
  parallel,
  exec,
  onScriptClose,
  fadeIn,
  waitTillInScreen,
  wait,
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects", "sint"]);
  audio.playAudio("sint");
  await setScrollingSpeed(250, 0, { instant: true });
  setAltitude(0, { instant: true });
  setBackground("city.Sunset", 0, 1);
  await setScenery("garden.Grass");
  showHUD();
  text.remove();
  exec(jinte({ existing: true }));

  await setScenery("garden.PondStart");

  await parallel([
    async () => {
      await exec(birdWave(5, "bird.pattern1"));
      await exec(birdWave(8, "bird.pattern2"));
    },
    async () => {
      await waitTillInScreen("garden.PondStart", -625);
    },
  ]);
  await wait(3000);
  await exec(fishWave(4, "fish.pattern1"));
  await exec(fishWave(4, "fish.pattern2"));
  await parallel([
    async () => {
      await exec(fishWave(4, "fish.pattern1"));
    },
    async () => {
      await exec(fishWave(4, "fish.pattern2"));
    },
  ]);

  await setAltitude(700);

  await exec(birdWave(5, "bird.pattern1"));
  await exec(birdWave(8, "bird.pattern2"));
  await exec(checkpoint);
};
