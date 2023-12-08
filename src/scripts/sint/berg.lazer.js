import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { say } from "../../lib/Dialog";
import { checkpoint } from "../common.lazer";
import Crafty from "../../crafty";
import { houseWave } from "./enemies/house.lazer";
import { jinte } from "./jinte.lazer";
import { birdWave } from "./enemies/birds.lazer";

export const berg = async ({
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
  setAltitude(700, { instant: true });
  await setScenery("garden.Pond");
  showHUD();
  text.remove();
  exec(jinte({ existing: true }));

  await setScenery("town.RoofTops");

  await parallel([
    async () => {
      await say("Jonas", "We moeten via Berg naar Maastricht vliegen", {
        portrait: "portraits.jonas",
      });
      await say("Jinte", "Zijn stoomboot ligt daar op de Maas?", {
        portrait: "portraits.jinte",
      });
      await say("Jonas", "Inderdaad", {
        portrait: "portraits.jonas",
      });
      await exec(birdWave(5, "bird.pattern4"));
    },
    async () => {
      await waitTillInScreen("town.RoofTops", -625);
    },
  ]);

  await parallel([
    async () => {
      await exec(birdWave(5, "bird.pattern5"));
    },
    async () => {
      await setAltitude(400);
    },
  ]);

  await exec(
    houseWave(5, "house.straight", {
      yOffsets: [0, 0.1, 0, -0.1, 0],
      shootModulo: 2,
    }),
  );
  await exec(birdWave(5, "bird.pattern4"));
  await exec(
    houseWave(5, "house.straight", {
      yOffsets: [0, 0.15, 0.5, -0.1, 0],
      shootModulo: 3,
    }),
  );

  const chapter2 = bigText("Stedentrip", {
    color: "#FFFFFF",
    sup: "Hoofdstuk 3:",
  });
  await chapter2.fadeIn(500);
  await wait(4_000);
  await chapter2.fadeOut(500);
  chapter2.remove();
  await exec(checkpoint);
};
