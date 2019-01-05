import { h } from "preact";

const gridStyle = (color, width, height) =>
  `background-image: repeating-linear-gradient(0deg,transparent,transparent ${height -
    1}px,${color} ${height - 1}px,${color} ${height}px),` +
  `repeating-linear-gradient(-90deg,transparent,transparent ${width -
    1}px,${color} ${width - 1}px,${color} ${width}px);` +
  `background-size: ${width}px ${height}px;`;

export const Grid = ({ width, height }) => (
  <div style={gridStyle("#CCC", width, height)} />
);
