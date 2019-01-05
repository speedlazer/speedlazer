import styles from "./LayerBox.scss";
import { h } from "preact";

export const LayerBox = ({ width, height, children }) => (
  <div
    class={styles.layerBox}
    style={{ width: `${width}px`, height: `${height}px` }}
  >
    {children}
  </div>
);
