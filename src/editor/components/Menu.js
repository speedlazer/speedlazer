import styles from "./Menu.scss";
import { Link } from "preact-router/match";
import { h } from "preact";

export const Menu = ({ items }) => (
  <menu class={styles.menu}>
    {items.map(([name, path]) => (
      <li key={path}>
        <Link activeClassName={styles.active} href={`/editor${path}`}>
          {name}
        </Link>
      </li>
    ))}
  </menu>
);
