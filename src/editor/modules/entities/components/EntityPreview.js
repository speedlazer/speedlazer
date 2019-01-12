import { h, Component } from "preact";
import { mount, showEntity } from "src/editor/lib/render-crafty";
import styles from "./EntityPreview.scss";

export class EntityPreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  render({ entity }, { craftyMounted }) {
    if (craftyMounted) {
      showEntity(entity);
    }
    return <div class={styles.preview} ref={this.mountCrafty} />;
  }
}
