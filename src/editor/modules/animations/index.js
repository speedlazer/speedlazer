import Composable from "../../../components/Composable";
import { EntityDefinition } from "../../../components/EntityDefinition";

import { AnimationPreview } from "./AnimationPreview";
import { animations } from "../../../data";
import { Menu } from "../../components/Menu";
import { CentralMenu } from "../../components/CentralMenu";
import { Source } from "../../components/Source";
import Log from "../../components/Log";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { h, Component } from "preact";
import Crafty from "../../../crafty";

const round3 = num => Math.round(num * 1000) / 1000;

const entityReport = entity => {
  if (entity.has(EntityDefinition)) {
    return {
      line: "Entity",
      props: {
        name: entity.appliedEntityName,
        state: entity.appliedEntityState,
        relativeX: round3(entity.x / Crafty.viewport.width),
        relativeY: round3(entity.y / Crafty.viewport.height)
      }
    };
  }
  if (entity.has(Composable)) {
    return {
      line: "Composable",
      props: {
        relativeX: round3(entity.x / Crafty.viewport.width),
        relativeY: round3(entity.y / Crafty.viewport.height)
      }
    };
  }
  return { line: "Unknown" };
};

const createSceneReport = player =>
  Object.entries(player.elements).reduce(
    (lines, [key, entity]) =>
      lines.concat({ pre: key, ...entityReport(entity) }),
    []
  );

class Animations extends Component {
  state = {
    animationLimit: 0,
    currentCheckpoint: 0,
    report: []
  };

  increaseLimit = () => {
    this.setState(s => ({
      ...s,
      animationLimit: s.animationLimit + 1
    }));
  };

  onCheckpointChange = ({ checkpoint, player }) => {
    this.setState(s => ({
      ...s,
      currentCheckpoint: checkpoint,
      report: createSceneReport(player)
    }));
  };

  componentDidUpdate(oldProps) {
    if (oldProps.animation !== this.props.animation) {
      this.setState(s => ({
        ...s,
        currentCheckpoint: 0,
        animationLimit: 0,
        report: []
      }));
    }
  }

  render(
    { animation, checkpoint },
    { animationLimit, currentCheckpoint, report }
  ) {
    const activeAnimation = animations(animation);
    return (
      <section>
        <Title>Animations</Title>
        <Divider>
          <CentralMenu root="animations" />
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
                  `${i}`,
                  `/animations/${animation}/checkpoints/${i}`
                ])}
              />
              <AnimationPreview
                animation={activeAnimation}
                activeCheckpoint={checkpoint ? parseInt(checkpoint, 10) : 0}
                animationLimit={animationLimit}
                onCheckpointChange={this.onCheckpointChange}
              />
              <Source code={activeAnimation} />
              <Log log={report} />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Animations;
