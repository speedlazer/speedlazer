import { h, Component } from "preact";
import { unmount, mount, showScenery } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";
import { setScrollVelocity, setAltitude } from "src/components/Scenery";

export class SceneryPreview extends Component {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.scenery !== this.props.scenery && this.state.craftyMounted) {
      showScenery(this.props.scenery, {
        background: this.props.background,
        checkpoint: this.props.backgroundCheckpoint
      });
    }
    if (
      this.props.scenery &&
      this.state.craftyMounted &&
      !prevState.craftyMounted
    ) {
      showScenery(this.props.scenery, {
        background: this.props.background,
        checkpoint: this.props.backgroundCheckpoint
      });
    }
    if (
      prevProps.scrollSpeed !== this.props.scrollSpeed &&
      this.props.scenery &&
      this.state.craftyMounted
    ) {
      setScrollVelocity({ vx: this.props.scrollSpeed, vy: 0 });
    }
    if (
      prevProps.altitude !== this.props.altitude &&
      this.props.scenery &&
      this.state.craftyMounted
    ) {
      setAltitude(this.props.altitude);
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}
