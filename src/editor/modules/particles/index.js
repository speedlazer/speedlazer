import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import ParticleEmitterPreview from "./ParticleEmitterPreview";
import particles from "src/data/particles";

class Particles extends Component {
  state = {
    emission: true
  };

  toggleEmission = () => {
    this.setState(state => ({ ...state, emission: !state.emission }));
  };

  render({ particles: p }, { emission }) {
    const activeParticles = particles[p];

    return (
      <section>
        <Title>Particles</Title>
        <Divider>
          <Menu
            items={Object.keys(particles).map(key => [
              key,
              `/particles/${key}`
            ])}
          />
          {activeParticles && (
            <div>
              <div>
                <button onClick={this.toggleEmission}>
                  {emission ? "stop" : "start"}
                </button>
              </div>
              <ParticleEmitterPreview
                emitter={activeParticles}
                active={emission}
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Particles;
