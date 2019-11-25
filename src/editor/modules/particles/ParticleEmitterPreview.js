import { h, Component } from "preact";
import {
  unmount,
  mount,
  showParticleEmitter
} from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";

const propChanged = (prevProps, props, checkChanged) =>
  checkChanged.some(prop => props[prop] !== prevProps[prop]);

export class ParticleEmitterPreview extends Component {
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
    if (
      (propChanged(prevProps, this.props, [
        "emitter",
        "difficulty",
        "collisionType"
      ]) &&
        this.state.craftyMounted) ||
      (this.props.emitter &&
        this.state.craftyMounted &&
        !prevState.craftyMounted)
    ) {
      showParticleEmitter(this.props.emitter, {});
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}

export default ParticleEmitterPreview;
