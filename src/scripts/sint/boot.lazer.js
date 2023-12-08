import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { say } from "../../lib/Dialog";
import { checkpoint } from "../common.lazer";
import Crafty from "../../crafty";
import { house, houseWave } from "./enemies/house.lazer";
import { jinte } from "./jinte.lazer";
import { birdWave } from "./enemies/birds.lazer";
import { fishWave } from "./enemies/fish.lazer";
import battleship from "./enemies/battleship.lazer";

export const stoomboot = async ({
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
  await loadAudio(["effects", "boss"]);
  audio.playAudio("boss");
  setBackground("city.Sunset", 4, 4);
  await setScrollingSpeed(250, 0, { instant: true });
  setAltitude(0, { instant: true });
  await setScenery("city.Ocean");
  showHUD();
  text.remove();
  exec(jinte({ existing: true }));

  await exec(battleship);
  const ready = bigText("Knockout!", { color: "#FFFFFF" });
  const blink = ready.blink(200, 4);

  await blink;
  await ready.zoomOut(500);
  ready.remove();
  await wait(2_000);

  await say("Jonas", "Woohoo!! Goed gedaan!", {
    portrait: "portraits.jonas",
  });
  await say("Jinte", "Kijk, zo doen we dat!", {
    portrait: "portraits.jinte",
  });
  await say("Jonas", "Dan is het nu tijd om je pakje open te maken", {
    portrait: "portraits.jonas",
  });
};
