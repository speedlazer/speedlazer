import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import ParticleEmitterPreview from "./ParticleEmitterPreview";
import particles from "src/data/particles";

class Particles extends Component {
  state = {
    emission: true,
    warmed: false
  };

  toggleEmission = (warmed = false) => {
    this.setState(state => ({ ...state, emission: !state.emission, warmed }));
  };

  render({ particles: p }, { emission, warmed }) {
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
                <button onClick={() => this.toggleEmission()}>
                  {emission ? "Stop" : "Start"}
                </button>
                {!emission && (
                  <button onClick={() => this.toggleEmission(true)}>
                    Start warmed
                  </button>
                )}
                <button
                  onClick={() => {
                    Crafty("Emitter").destroy();
                  }}
                >
                  Destroy emitter
                </button>
              </div>
              <ParticleEmitterPreview
                emitter={activeParticles}
                active={emission}
                warmed={warmed}
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Particles;
