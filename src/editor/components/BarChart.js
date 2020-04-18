import { h } from "preact";
import styles from "./BarChart.scss";

const perc = (amount, max) => `${(amount / max) * 100}%`;

export const BarChart = ({ data }) => (
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
);
