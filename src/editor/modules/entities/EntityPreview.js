import { h, Component } from "preact";
import { unmount, mount, showEntity } from "editor/lib/render-crafty";
import Preview from "editor/components/Preview";

export class EntityPreview extends Component {
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

  render({ entity, state, habitat }, { craftyMounted }) {
    if (craftyMounted) {
      showEntity(entity, { state, habitat });
    }
    return <Preview onMount={this.mountCrafty} />;
  }
}
