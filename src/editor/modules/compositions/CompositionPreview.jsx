import { h, Component } from "preact";
import { unmount, mount, showComposition } from "../../lib/render-crafty";
import Preview from "../../components/Preview";

export class CompositionPreview extends Component {
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

  render(
    { composition, frame, animation, tweenDuration, ...displaySettings },
    { craftyMounted }
  ) {
    if (craftyMounted) {
      if (frame) {
        showComposition(composition, {
          frame,
          tweenDuration,
          ...displaySettings
        });
      } else if (animation) {
        showComposition(composition, {
          animation,
          ...displaySettings
        });
      } else {
        showComposition(composition, displaySettings);
      }
    }
    return <Preview onMount={this.mountCrafty} />;
  }
}
