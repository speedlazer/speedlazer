import styles from "./Menu.scss";
import { Link } from "preact-router/match";
import { h, Component } from "preact";

const classes = def =>
  Object.entries(def)
    .filter(([, active]) => active)
    .map(([name]) => name)
    .join(" ");

const isFolder = name => f => f.type === "folder" && f.name === name;

const makeFolders = (acc, [name, path]) => {
  if (name.includes(".")) {
    const [folder, ...itemName] = name.split(".");
    const existingFolder = acc.find(isFolder(folder));
    if (!existingFolder) {
      return acc.concat({
        name: folder,
        type: "folder",
        items: [[itemName.join("."), path]]
      });
    }
    return acc.map(e =>
      isFolder(folder)(e)
        ? { ...e, items: e.items.concat([[itemName.join("."), path]]) }
        : e
    );
  }
  return acc.concat({ name, path, type: "item" });
};

const Item = ({ name, path }) => (
  <li class={styles.item}>
    {typeof path === "string" ? (
      <Link activeClassName={styles.active} href={path}>
        {name}
      </Link>
    ) : typeof path === "function" ? (
      <a
        activeClassName={styles.active}
        href="#"
        onClick={e => {
          e.preventDefault();
          path(e);
        }}
      >
        {name}
      </a>
    ) : (
      name
    )}
  </li>
);

class Folder extends Component {
  state = { open: false };
  render({ name, items }, { open }) {
    return (
      <li
        class={`${styles.folder} ${
          open ? styles.folderOpen : styles.folderClosed
        }`}
      >
        <span
          class={styles.folderName}
          onClick={() => this.setState(state => ({ open: !state.open }))}
        >
          {name}
        </span>
        {open && <ul>{createStructure(items.reduce(makeFolders, []))}</ul>}
      </li>
    );
  }
}

const createStructure = items =>
  items
    .filter(({ type }) => type === "folder")
    .map(folder => (
      <Folder key={folder.name} name={folder.name} items={folder.items} />
    ))
    .concat(
      items
        .filter(({ type }) => type === "item")
        .map(item => (
          <Item
            key={item.path}
            name={item.name}
            path={
              typeof item.path === "string"
                ? `/editor${item.path}`
                : item.path
                ? item.path
                : null
            }
          />
        ))
    );

export const Menu = ({ items, horizontal }) => (
  <menu
    class={classes({ [styles.menu]: true, [styles.horizontal]: horizontal })}
  >
    {createStructure(items.reduce(makeFolders, []))}
  </menu>
);
