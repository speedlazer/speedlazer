import { h, Component } from "preact";
import { mount, showBackground } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";

export class BackgroundPreview extends Component {
  constructor() {
    super();
    this.state = { craftyMounted: false };
  }

  mountCrafty = domElem => {
    mount(domElem);
    this.setState({ craftyMounted: true });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.background !== this.props.background &&
      this.state.craftyMounted
    ) {
      showBackground(this.props.background);
    }
    if (
      this.props.background &&
      this.state.craftyMounted &&
      !prevState.craftyMounted
    ) {
      showBackground(this.props.background);
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}
