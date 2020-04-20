import { h } from "preact";
import ToggleBox from "./ToggleBox";
import styles from "./BarChart.scss";

const perc = (amount, max) => `${(amount / max) * 100}%`;

export const BarChart = ({ data }) => (
  <ToggleBox term="graph">
    <div class={styles.chart}>
      {data.map(({ amount }, i) => (
        <div
          key={i}
          class={styles.bar}
          title={amount}
          style={{ height: perc(amount, 1024) }}
        />
      ))}
    </div>
  </ToggleBox>
);
