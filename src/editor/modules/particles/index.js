import { h, Component } from "preact";
import { Title } from "editor/components/Title";
import { CentralMenu } from "editor/components/CentralMenu";
import { Source } from "editor/components/Source";
import { Divider } from "editor/components/Divider";
import ParticleEmitterPreview from "./ParticleEmitterPreview";
import { particles } from "data";

class Particles extends Component {
  state = {
    emission: true,
    warmed: false,
    move: false
  };

  toggleEmission = (warmed = false) => {
    this.setState(state => ({ ...state, emission: !state.emission, warmed }));
  };

  toggleMotion = () => {
    this.setState(state => ({ ...state, move: !state.move }));
  };

  render({ particles: p }, { emission, warmed, move }) {
    const activeParticles = particles(p);

    return (
      <section>
        <Title>Particles{activeParticles && ` - ${p}`}</Title>
        <Divider>
          <CentralMenu hoverHide={p} root="particles" />
          {activeParticles && (
            <div>
              <div>
                <button onClick={() => this.toggleEmission()}>
                  {emission ? "Stop Emitter" : "Start Emitter"}
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
                <button onClick={() => this.toggleMotion()}>
                  {move ? "Stop moving" : "Move emitter"}
                </button>
              </div>
              <ParticleEmitterPreview
                emitter={activeParticles}
                active={emission}
                warmed={warmed}
                move={move}
              />
              <Source code={activeParticles} />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Particles;
