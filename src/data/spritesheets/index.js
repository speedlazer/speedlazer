import trailerScenery from "src/images/dino.png";
import trailerSceneryMap from "src/images/dino.map.json";

import megaTexture from "src/images/mega-texture.png";
import completeTextureMap from "src/images/mega-texture.map.json";

const spritesheets = [
  { name: "mega-texture", image: megaTexture, map: completeTextureMap },
  {
    name: "dino",
    image: trailerScenery,
    map: trailerSceneryMap
  }
];

export default spritesheets;
