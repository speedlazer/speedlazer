import { helicopter } from "./enemies/helicopter.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setAltitude,
  setBackground,
  exec
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");

  await setScrollingSpeed(100, 0);
  setAltitude(200, { instant: true });
  setBackground("City.Sunrise");
  await setScenery("City.Ocean");
  text.remove();
  exec(playerShip({ existing: true }));

  setAltitude(0);
  await exec(helicopter("heli.pattern1"));
};

export default part;
