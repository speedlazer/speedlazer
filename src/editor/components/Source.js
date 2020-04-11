import { h, Component } from "preact";
import { sourceCode, toggleSource } from "./Source.scss";

export class Source extends Component {
  state = { collapsed: true };

  toggleSource = e => {
    e.preventDefault();
    this.setState(state => ({ ...state, collapsed: !state.collapsed }));
    return false;
  };

  render({ code }, { collapsed }) {
    return (
      <div>
        <a class={toggleSource} href="#" onClick={this.toggleSource}>
          {collapsed ? "Show" : "Hide"} source
        </a>
        {!collapsed && (
          <div class={sourceCode}>{JSON.stringify(code, null, 2)}</div>
        )}
      </div>
    );
  }
}
