import Crafty from "../../crafty";

export const centeredText = (
  text,
  parent,
  y,
  color = "#FFFFFF",
  size = "20px"
) => {
  const textItem = Crafty.e("2D, UILayerDOM, Text")
    .attr({ x: parent.x, y: parent.y + y, w: parent.w, z: parent.z + 1 })
    .text(text)
    .textColor(color)
    .textAlign("center")
    .textFont({
      size: size,
      weight: "bold",
      family: "Press Start 2P"
    });
  parent.attach(textItem);
  return textItem;
};
