import { h, Component } from "preact";
import { toggleBox } from "./ToggleBox.scss";

export default class ToggleBox extends Component {
  state = { collapsed: true };

  toggleSource = e => {
    e.preventDefault();
    this.setState(state => ({ ...state, collapsed: !state.collapsed }));
    return false;
  };

  render({ children, term }, { collapsed }) {
    return (
      <div>
        <a class={toggleBox} href="#" onClick={this.toggleSource}>
          {collapsed ? "Show" : "Hide"} {term}
        </a>
        {!collapsed && children[0]}
      </div>
    );
  }
}
