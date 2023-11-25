import { h, Component } from "preact";
import { unmount, mount, showGame } from "../../lib/render-crafty";
import Preview from "../../components/Preview";
import Crafty from "../../../crafty";

export class GamePreview extends Component {
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

  measureStats = () => {
    const that = this;
    return {
      start: () => {
        that.stats = [];
        that.timestamp = new Date() * 1;
        that.interval = setInterval(() => {
          const ts = new Date() * 1 - that.timestamp;
          let counter = 0;
          Crafty("Renderable, WebGL").each(function() {
            if (!this.__frozen) counter++;
          });
          that.stats = that.stats.concat({
            ts,
            amount: counter
          });
          that.props.onStats(that.stats);
        }, 1000);
      },
      stop: () => {
        clearInterval(that.interval);
        that.interval = null;
      }
    };
  };

  render({ stage, invincible, autoContinue, extraLifes }, { craftyMounted }) {
    if (craftyMounted) {
      const { start, stop } = this.measureStats();
      showGame(stage, {
        invincible,
        autoContinue,
        extraLifes,
        onStart: start,
        onStop: stop
      });
    }
    return <Preview onMount={this.mountCrafty} />;
  }
}
