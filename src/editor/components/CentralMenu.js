import { h } from "preact";
import { Menu } from "./Menu";
import { data } from "data";

const produceItems = root =>
  Object.keys(data[root]).map(key => [key, `/${root}/${key}`]);

export const CentralMenu = ({ root, hoverHide }) => (
  <Menu hoverHide={hoverHide} items={produceItems(root)} />
);
