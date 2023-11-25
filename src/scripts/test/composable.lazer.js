import { bigText } from "../../components/BigText";
import Crafty from "../../crafty";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  showHUD,
  wait,
  exec
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects"]);
  await setScrollingSpeed(0, 0, { instant: true });
  await setScenery("Test.Walls");
  showHUD();
  text.remove();
  let measure = +new Date();

  Crafty.bind("EnterFrame", fd => {
    const now = +new Date();
    const diff = (now - measure) % 60e3;
    if (diff < 40) {
      console.log(1000 / fd.dt, "FPS");
    }
  });

  await wait(5 * 60e3);
};

export default part;
