import { h } from "preact";

export const ScrollBox = ({ width, height, children }) => (
  <div
    style={{
      width,
      height,
      overflow: "scroll"
    }}
  >
    {children}
  </div>
);
