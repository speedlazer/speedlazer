import { h, Component } from "preact";
import { unmount, mount, showAnimation } from "editor/lib/render-crafty";
import Preview from "editor/components/Preview";

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
        this.props.activeCheckpoint,
        { onCheckpointChange: this.props.onCheckpointChange }
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
        this.props.activeCheckpoint,
        { onCheckpointChange: this.props.onCheckpointChange }
      );
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}
