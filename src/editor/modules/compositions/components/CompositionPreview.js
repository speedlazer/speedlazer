import { h, Component } from "preact";
import styles from "./CompositionPreview.scss";
import { mount, showComposition } from "src/editor/lib/render-crafty";

export class CompositionPreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  render({ composition }, { craftyMounted }) {
    if (craftyMounted) {
      showComposition(composition);
    }
    return <div class={styles.preview} ref={this.mountCrafty} />;
  }
}
