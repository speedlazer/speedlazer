import { h } from "preact";
import * as styles from "./LayerBox.module.scss";

export const LayerBox = ({ width, height, children, onClick }) => (
  <div
    class={styles.layerBox}
    style={{ width: `${width}px`, height: `${height}px` }}
    onClick={onClick}
  >
    {children}
  </div>
);
