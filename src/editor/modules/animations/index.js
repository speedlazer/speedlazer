import { AnimationPreview } from "./AnimationPreview";
import animations from "src/data/animations";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { h, Component } from "preact";

class Animations extends Component {
  state = {
    animationLimit: 0,
    currentCheckpoint: 0
  };

  increaseLimit = () => {
    this.setState(s => ({
      ...s,
      animationLimit: s.animationLimit + 1
    }));
  };

  onCheckpointChange = newCheckpoint => {
    this.setState(s => ({
      ...s,
      currentCheckpoint: newCheckpoint
    }));
  };

  componentDidUpdate(oldProps) {
    if (oldProps.animation !== this.props.animation) {
      this.setState(s => ({
        ...s,
        currentCheckpoint: 0,
        animationLimit: 0
      }));
    }
  }

  render({ animation, checkpoint }, { animationLimit, currentCheckpoint }) {
    const activeAnimation = animations[animation];
    return (
      <section>
        <Title>Animations</Title>
        <Divider>
          <Menu
            items={Object.keys(animations).map(key => [
              key,
              `/animations/${key}`
            ])}
          />
          {activeAnimation && (
            <div>
              <div>
                <Text>{animationLimit}</Text>
                <button
                  onClick={this.increaseLimit}
                  disabled={
                    activeAnimation.checkpoints.length <= animationLimit
                  }
                >
                  Increase allowed checkpoint
                </button>
                <Text>Currently at: {currentCheckpoint}</Text>
              </div>
              <Menu
                horizontal={true}
                items={activeAnimation.checkpoints.map((a, i) => [
                  `${i + 1}`,
                  `/animations/${animation}/checkpoints/${i}`
                ])}
              />
              <AnimationPreview
                animation={activeAnimation}
                activeCheckpoint={checkpoint ? parseInt(checkpoint, 10) : 0}
                animationLimit={animationLimit}
                onCheckpointChange={this.onCheckpointChange}
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Animations;
