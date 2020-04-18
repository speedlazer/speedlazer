import { h, Component } from "preact";
import { unmount, mount, showGame } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";

export class GamePreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  componentWillUnmount() {
    this.state.craftyMounted && unmount();
  }

  render({ stage, invincible }, { craftyMounted }) {
    if (craftyMounted) {
      showGame(stage, { invincible });
    }
    return <Preview onMount={this.mountCrafty} />;
  }
}
