import { h, Component } from "preact";
import { mount, showScenery } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";

export class SceneryPreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  render({ scenery }, { craftyMounted }) {
    if (craftyMounted) {
      showScenery(scenery);
    }
    return <Preview onMount={this.mountCrafty} />;
  }
}
