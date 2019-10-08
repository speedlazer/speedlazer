import { h, Component } from "preact";
import { mount, showScenery } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";
import { setScrollVelocity } from "src/components/Scenery";

export class SceneryPreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.scenery !== this.props.scenery && this.state.craftyMounted) {
      showScenery(this.props.scenery, this.props.background);
    }
    if (
      this.props.scenery &&
      this.state.craftyMounted &&
      !prevState.craftyMounted
    ) {
      showScenery(this.props.scenery, this.props.background);
    }
    if (
      prevProps.scrollSpeed !== this.props.scrollSpeed &&
      this.props.scenery &&
      this.state.craftyMounted
    ) {
      setScrollVelocity({ vx: this.props.scrollSpeed, vy: 0 });
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}
