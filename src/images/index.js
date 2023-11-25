import trailerScenery from "url:./dino.png";
import trailerSceneryMap from "./dino.map.json";

import megaTexture from "url:./mega-texture.png";
import completeTextureMap from "./mega-texture.map.json";

const spritesheets = [
  { name: "mega-texture", image: megaTexture, map: completeTextureMap },
  {
    name: "dino",
    image: trailerScenery,
    map: trailerSceneryMap
  }
];
console.log(spritesheets)

export default spritesheets;
