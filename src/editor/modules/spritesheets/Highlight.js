import { h } from "preact";

export const Highlight = ({ highlight, tileWidth, tileHeight }) => (
  <div
    style={{
      marginLeft: `${highlight[0] * tileWidth}px`,
      marginTop: `${highlight[1] * tileHeight}px`,
      width: `${highlight[2] * tileWidth}px`,
      height: `${highlight[3] * tileHeight}px`,
      background: `rgba(192, 192, 192, 0.5)`
    }}
  />
);
