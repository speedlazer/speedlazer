import { h, Component } from "preact";
import { Menu } from "./Menu";
import { getCurrentUrl } from "preact-router";
import { data } from "data";

const useLocalStorage = (component, itemName, initialValue) => {
  let value = initialValue;
  try {
    const data = window.localStorage.getItem(itemName);
    if (data) {
      value = JSON.parse(data);
    }
  } catch (e) {
    console.log("no stored data");
  }
  const setter = newValue => {
    window.localStorage.setItem(itemName, JSON.stringify(newValue));
    component.forceUpdate();
  };

  return [value, setter];
};

const produceCategoryItems = root =>
  Object.keys(data[root]).map(key => [key, `/${root}/${key}`]);

const produceSmartItems = () => {
  const url = getCurrentUrl();
  const [, , activeRoot, itemPath] = url.split("/");
  if (itemPath === undefined) return [];

  const itemData = data[activeRoot][itemPath];
  const diskFolder = itemData.diskFolder;

  const items = Object.entries(data).reduce(
    (acc, [category, items]) =>
      acc.concat(
        Object.entries(items)
          .filter(([, value]) => value.diskFolder === diskFolder)
          .map(([key]) => [
            key,
            `/${category}/${key}`,
            { native: true, category }
          ])
      ),
    []
  );

  return items;
};

export class CentralMenu extends Component {
  render({ root, hoverHide }) {
    const [categoryMode, setCategoryMode] = useLocalStorage(
      this,
      "category-mode",
      true
    );

    return (
      <div>
        <label style={{ color: "white", whiteSpace: "nowrap" }}>
          <input
            type="checkbox"
            checked={categoryMode}
            onInput={e => setCategoryMode(e.target.checked)}
          />
          Category mode
        </label>
        <Menu
          hoverHide={hoverHide}
          items={
            categoryMode ? produceCategoryItems(root) : produceSmartItems()
          }
        />
      </div>
    );
  }
}
