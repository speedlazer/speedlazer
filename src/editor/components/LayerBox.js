import styles from "./LayerBox.scss";
import { h } from "preact";

export const LayerBox = ({ width, height, children, onClick }) => (
  <div
    class={styles.layerBox}
    style={{ width: `${width}px`, height: `${height}px` }}
    onClick={onClick}
  >
    {children}
  </div>
);
