import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { say } from "../../lib/Dialog";
import { checkpoint } from "../common.lazer";
import Crafty from "../../crafty";
import { house } from "./enemies/house.lazer";
import { jinte } from "./jinte.lazer";
import { birdWave } from "./enemies/birds.lazer";

// const handleBox =
//   (box) =>
//   async ({ showState, allowDamage, waitForEvent, call, awardPoints }) => {
//     await allowDamage(box, { health: 30 });
//     waitForEvent(box, "Dead", async () => {
//       awardPoints(25, box.x, box.y);
//       showState(box, "falling");
//       await call(box.activateGravity, "GravityLiquid");
//     });
//   };

const intro = async ({
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
  wait,
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects", "sint"]);
  audio.playAudio("sint");

  await setScrollingSpeed(0, 0, { instant: true });
  await setScenery("garden.Grass");

  setBackground("city.Sunset", 0, 1);

  const fade = fadeIn();
  text.remove();

  //   const introAnimation = playAnimation("city.Intro");
  //   const introShip = Crafty("IntroShip").get(0);
  //   exec(handleBox(introShip.boxLocation1));
  //   exec(handleBox(introShip.boxLocation2));

  exec(jinte({ existing: true }));
  //   const player = Crafty("PlayerShip").get(0);

  await fade.start(1000);
  await say("Jinte", "Kijk Jonas, een lekker tas vol wortels voor je", {
    portrait: "portraits.jinte",
  });
  await say("Jonas", "Dank je, dat is perfecte munitie!", {
    portrait: "portraits.jonas",
  });
  await say("Jinte", "Waaah, je praat!", {
    portrait: "portraits.jinte",
  });
  await say(
    "Jonas",
    "We zitten in jouw droomwereld. Ik kan hier zelfs vliegen!",
    {
      portrait: "portraits.jonas",
    },
  );
  await say("Jonas", "Maar Sinterklaas in deze wereld is op hol geslagen!", {
    portrait: "portraits.jonas",
  });
  await say("Jinte", "Is Sinterklaas hier ook!??", {
    portrait: "portraits.jinte",
  });
  await say("Jonas", "Jazeker! Maar we moeten hem stoppen, laten we gaan!", {
    portrait: "portraits.jonas",
  });
  await say("Jonas", "Daarvoor had me toch munitie gebracht?", {
    portrait: "portraits.jonas",
  });

  showHUD();
  await setScrollingSpeed(250, 0);
  const ready = bigText("Klaar voor de start", { color: "#FF0000" });
  const blink = ready.blink(200, 4);

  await blink;
  await ready.zoomOut(500);
  ready.remove();
  await wait(2_000);
  await say("Jonas", "Pas op voor de plofmussen!", {
    portrait: "portraits.jonas",
  });

  await parallel([
    () => exec(birdWave(2, "bird.straight", { delay: 300, yOffset: 0.1 })),
    async () => {
      await wait(1500);
      await exec(birdWave(2, "bird.straight", { delay: 300, yOffset: -0.1 }));
    },
    async () => {
      await wait(3000);
      await exec(birdWave(2, "bird.straight", { delay: 300, yOffset: -0.3 }));
    },
  ]);
  const chapter1 = bigText("Strijd om de tuin", {
    color: "#FFFFFF",
    sup: "Hoofdstuk 1:",
  });
  await wait(2_000);
  chapter1.remove();

  await exec(checkpoint);
};

export default intro;
