import battleship from "./enemies/battleship.lazer";
import { droneWave } from "./enemies/drones.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { checkpoint } from "../common.lazer";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  exec,
  showHUD
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects", "hero"]);
  audio.playAudio("hero");

  await setScrollingSpeed(350, 0, { instant: true });
  await setScenery("city.Coast");
  setBackground("city.Sunrise", 2, 2);
  showHUD();
  text.remove();
  exec(playerShip({ existing: true }));
  await exec(droneWave(5, "drone.pattern2"));

  await exec(battleship);
  await exec(checkpoint);
};

export default part;
