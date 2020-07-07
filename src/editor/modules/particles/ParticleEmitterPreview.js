import { h, Component } from "preact";
import { unmount, mount, showParticleEmitter } from "editor/lib/render-crafty";
import Preview from "editor/components/Preview";

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
      (propChanged(prevProps, this.props, ["emitter", "active"]) &&
        this.state.craftyMounted) ||
      (this.props.emitter &&
        this.state.craftyMounted &&
        !prevState.craftyMounted)
    ) {
      showParticleEmitter(this.props.emitter, {
        active: this.props.active,
        warmed: this.props.warmed
      });
    }
    if (
      propChanged(prevProps, this.props, ["move"]) &&
      this.state.craftyMounted
    ) {
      if (this.props.move) {
        Crafty("Emitter").flyPattern(
          [
            { x: 0.5, y: 0.5 },
            { x: 0.9, y: 0.2 },
            { x: 0.7, y: 0.8 },
            { x: 0.5, y: 0.2 },
            { x: 0.3, y: 0.8 },
            { x: 0.1, y: 0.5 },
            { x: 0.3, y: 0.2 },
            { x: 0.9, y: 0.5 },
            { x: 0.4, y: 0.9 },
            { x: 0.5, y: 0.5 }
          ],
          {
            duration: 15000
          }
        );
      } else {
        Crafty("Emitter").stopFlyPattern();
      }
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}

export default ParticleEmitterPreview;
