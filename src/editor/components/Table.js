import { h } from "preact";
import { Text } from "./Text";
import styles from "./Table.scss";

const makeRow = (child, index) => {
  if (!child) return;
  if (child.nodeName === Text) {
    return (
      <tr key={index} class={styles.row}>
        <th class={styles.rowLabel}>{child.attributes.label}</th>
        <td class={styles.rowData}>{child.children}</td>
      </tr>
    );
  }

  return (
    <tr key={index} class={styles.row}>
      <td colSpan="2" class={styles.rowData}>
        {child}
      </td>
    </tr>
  );
};

export const Table = ({ children }) => (
  <table class={styles.table}>{children.map(makeRow)}</table>
);
