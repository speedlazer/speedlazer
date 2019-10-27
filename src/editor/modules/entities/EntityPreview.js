import { h, Component } from "preact";
import { mount, showEntity } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";

export class EntityPreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  render({ entity, state, habitat }, { craftyMounted }) {
    if (craftyMounted) {
      showEntity(entity, { state, habitat });
    }
    return <Preview onMount={this.mountCrafty} />;
  }
}
