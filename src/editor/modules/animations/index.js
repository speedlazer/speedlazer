import { AnimationPreview } from "./AnimationPreview";
import animations from "src/data/animations";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { h, Component } from "preact";

class Animations extends Component {
  state = {
    animationLimit: 0
  };

  increaseLimit = () => {
    this.setState(s => ({
      ...s,
      animationLimit: s.animationLimit + 1
    }));
  };

  render({ animation, checkpoint }, { animationLimit }) {
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
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Animations;
