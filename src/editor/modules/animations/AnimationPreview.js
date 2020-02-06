import { h, Component } from "preact";
import { unmount, mount, showAnimation } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";

export class AnimationPreview extends Component {
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
      (prevProps.animation !== this.props.animation ||
        prevProps.animationLimit !== this.props.animationLimit ||
        prevProps.activeCheckpoint !== this.props.activeCheckpoint) &&
      this.state.craftyMounted
    ) {
      showAnimation(
        this.props.animation,
        this.props.animationLimit,
        this.props.activeCheckpoint
      );
    }
    if (
      this.props.animation &&
      this.state.craftyMounted &&
      !prevState.craftyMounted
    ) {
      showAnimation(
        this.props.animation,
        this.props.animationLimit,
        this.props.activeCheckpoint
      );
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}