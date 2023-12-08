import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { say } from "../../lib/Dialog";
import { checkpoint } from "../common.lazer";
import Crafty from "../../crafty";
import { house, houseWave } from "./enemies/house.lazer";
import { jinte } from "./jinte.lazer";
import { birdWave } from "./enemies/birds.lazer";

export const maastricht = async ({
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
  setBackground("city.Sunset", 1, 2);
  await setScrollingSpeed(250, 0, { instant: true });
  setAltitude(400, { instant: true });
  await setScenery("garden.RoofTops");
  showHUD();
  text.remove();
  exec(jinte({ existing: true }));

  await setScenery("town.Rasberg");

  const chapter2 = bigText("Zie ginds komt...", {
    color: "#FFFFFF",
    sup: "Hoofdstuk 3:",
  });
  await chapter2.fadeIn(500);
  await wait(4_000);
  await chapter2.fadeOut(500);
  chapter2.remove();

  await parallel([
    async () => {
      await say("Jinte", "Ik zie Maastricht al, we zijn er bijna!", {
        portrait: "portraits.jinte",
      });
      await exec(birdWave(5, "bird.pattern4"));
    },
    async () => {
      await waitTillInScreen("town.Rasberg", -625);
    },
  ]);

  await exec(birdWave(5, "bird.pattern5"));

  await exec(checkpoint);
};
