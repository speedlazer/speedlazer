import { h, Component } from "preact";
import { mount, showComposition } from "src/editor/lib/render-crafty";
import styles from "./CompositionPreview.scss";

export class CompositionPreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  render({ composition, frame, tweenDuration }, { craftyMounted }) {
    if (craftyMounted) {
      if (frame) {
        showComposition(composition, { frame, tweenDuration });
      } else {
        showComposition(composition);
      }
    }
    return <div class={styles.preview} ref={this.mountCrafty} />;
  }
}
