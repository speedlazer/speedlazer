import { h } from "preact";
import styles from "./Log.scss";

const Log = ({ log }) => (
  <div class={styles.log}>
    {log.map((line, i) => (
      <span key={i} class={styles.line}>
        <span class={styles.pre}>{line.pre}</span> {line.line}
        {line.props && (
          <span class={styles.props}>
            ({" "}
            {Object.entries(line.props).map(([key, value], i) => (
              <span key={i}>
                {key}: <span class={styles.value}>{value}</span>{" "}
              </span>
            ))}
            )
          </span>
        )}
      </span>
    ))}
  </div>
);

export default Log;
