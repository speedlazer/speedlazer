import { h, Component } from "preact";
import { mount, showBulletPattern } from "src/editor/lib/render-crafty";
import Preview from "src/editor/components/Preview";

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

  componentDidUpdate(prevProps, prevState) {
    if (
      (propChanged(prevProps, this.props, ["difficulty"]) &&
        this.state.craftyMounted) ||
      (this.props.pattern &&
        this.state.craftyMounted &&
        !prevState.craftyMounted)
    ) {
      showBulletPattern(this.props.pattern, {
        difficulty: this.props.difficulty
      });
    }
  }

  render() {
    return <Preview onMount={this.mountCrafty} />;
  }
}

export default BulletPatternPreview;
