import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { say } from "../../lib/Dialog";
import { checkpoint } from "../common.lazer";
import Crafty from "../../crafty";
import { house, houseWave } from "./enemies/house.lazer";
import { jinte } from "./jinte.lazer";
import { birdWave } from "./enemies/birds.lazer";
import { fishWave } from "./enemies/fish.lazer";

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
  setBackground("city.Sunset", 2, 3);
  await setScrollingSpeed(250, 0, { instant: true });
  setAltitude(400, { instant: true });
  await setScenery("town.RoofTops");
  showHUD();
  text.remove();
  exec(jinte({ existing: true }));

  await setScenery("town.Rasberg");

  await parallel([
    async () => {
      await say("Jinte", "Ik zie Maastricht al, we zijn er bijna!", {
        portrait: "portraits.jinte",
      });
      await exec(birdWave(4, "bird.pattern2"));
    },
    async () => {
      await waitTillInScreen("town.Rasberg", -1020);
    },
  ]);
  await wait(7_000);
  // Meeuwen
  await exec(birdWave(1, "bird.pattern6", { gull: true, points: 30 }));
  await say("Jonas", "Gatver! Flatsmeeuwen", {
    portrait: "portraits.jonas",
  });
  await parallel([
    () =>
      exec(
        birdWave(2, "bird.pattern2", { delay: 1_000, points: 30, gull: true }),
      ),
    () => setAltitude(0),
  ]);

  await exec(fishWave(4, "fish.pattern1"));

  await setScenery("city.Bridge");

  await parallel([
    async () => {
      await exec(fishWave(4, "fish.pattern1"));
    },
    async () => {
      await exec(fishWave(4, "fish.pattern2"));
    },
  ]);
  await exec(
    birdWave(2, "bird.pattern2", { delay: 1_000, points: 30, gull: true }),
  );
  await say("Jonas", "Het moet nu niet ver meer zijn!", {
    portrait: "portraits.jonas",
  });
  await say("Jinte", "Ik hoop het, want ik wil mijn pakje open maken", {
    portrait: "portraits.jinte",
  });

  await waitTillInScreen("city.Bridge", 520);
  await setScenery("city.BayEnd");
  await wait(3_000);

  await exec(fishWave(4, "fish.pattern1"));
  await exec(fishWave(4, "fish.pattern1"));
  await setScenery("city.CoastEnd");
  audio.fadeMusicVolume(0.2, 5000);
  await wait(3_000);
  await say("Jinte", "Hey, wat is het ineens stil...", {
    portrait: "portraits.jinte",
  });

  await exec(fishWave(4, "fish.pattern2"));
  await say("Jonas", "Ja, dat is vast om de spanning op te bouwen", {
    portrait: "portraits.jonas",
  });

  await exec(
    birdWave(3, "bird.pattern2", { delay: 2_000, points: 30, gull: true }),
  );
  const chapter2 = bigText("Zie ginds...", {
    color: "#FFFFFF",
    sup: "Hoofdstuk 4:",
  });
  audio.fadeMusicVolume(0, 2000);
  await chapter2.fadeIn(500);
  await wait(4_000);
  await chapter2.fadeOut(500);
  chapter2.remove();
  await exec(checkpoint);
};
