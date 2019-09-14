import styles from "./Menu.scss";
import { Link } from "preact-router/match";
import { h } from "preact";

const classes = def =>
  Object.entries(def)
    .filter(([, active]) => active)
    .map(([name]) => name)
    .join(" ");

export const Menu = ({ items, horizontal }) => (
  <menu
    class={classes({ [styles.menu]: true, [styles.horizontal]: horizontal })}
  >
    {items.map(([name, path]) => (
      <li key={path}>
        <Link activeClassName={styles.active} href={`/editor${path}`}>
          {name}
        </Link>
      </li>
    ))}
  </menu>
);
