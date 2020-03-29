import { h, Component } from "preact";
import { unmount, mount, showScenery } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";
import { EASE_IN_OUT } from "src/constants/easing";
import {
  setScrollVelocity,
  setAltitude,
  getAltitude
} from "src/components/Scenery";

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
      new Promise(resolve => {
        const altPSec = 50 / 1000;
        const startAlt = getAltitude();
        const delta = Math.abs(this.props.altitude - startAlt);

        const ease = new Crafty.easing(delta / altPSec, EASE_IN_OUT);
        const f = ({ dt }) => {
          ease.tick(dt);
          const v = ease.value();
          if (v >= 1.0) {
            Crafty.unbind("EnterFrame", f);
            resolve();
          }
          const alt = startAlt * (1 - v) + this.props.altitude * v;
          setAltitude(alt);
        };

        Crafty.bind("EnterFrame", f);
      });
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}
