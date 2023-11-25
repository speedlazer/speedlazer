import { h, Component } from "preact";
import { unmount, mount, showBulletPattern } from "../../lib/render-crafty";
import Preview from "../../components/Preview";
import Crafty from "../../../crafty";

const propChanged = (prevProps, props, checkChanged) =>
  checkChanged.some(prop => props[prop] !== prevProps[prop]);

export class BulletPatternPreview extends Component {
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
        "weapon",
        "firing",
        "difficulty",
        "swapped",
        "collisionType"
      ]) &&
        this.state.craftyMounted) ||
      (this.props.weapon &&
        this.state.craftyMounted &&
        !prevState.craftyMounted)
    ) {
      showBulletPattern(this.props.weapon, {
        difficulty: this.props.difficulty,
        collisionType: this.props.collisionType,
        firing: this.props.firing,
        swapped: this.props.swapped
      });
    }
    if (
      propChanged(prevProps, this.props, ["moveBlue"]) &&
      this.state.craftyMounted
    ) {
      if (this.props.moveBlue) {
        Crafty("Blue").flyPattern(
          [
            { x: 0.1, y: 0.5 },
            { x: 0.9, y: 0.2 },
            { x: 0.7, y: 0.8 },
            { x: 0.5, y: 0.2 },
            { x: 0.3, y: 0.8 },
            { x: 0.1, y: 0.5 },
            { x: 0.3, y: 0.2 },
            { x: 0.9, y: 0.5 },
            { x: 0.4, y: 0.9 },
            { x: 0.1, y: 0.5 }
          ],
          {
            duration: 15000
          }
        );
      } else {
        Crafty("Blue").stopFlyPattern();
      }
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}

export default BulletPatternPreview;
