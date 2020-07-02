// eslint env mocha
import { expect } from "chai";
import synchroniser from "../../src/lib/synchroniser";

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

describe("Synchroniser", () => {
  it("creates a synchronisation space", () => {
    const syncSpace = synchroniser();
    const sync1 = syncSpace.addSynchronisation();

    expect(syncSpace.listeners).to.eql(1);
    expect(syncSpace.completed).to.eql(0);
  });

  it("continues on completion of single item", async () => {
    const syncSpace = synchroniser();
    const sync1 = syncSpace.addSynchronisation();

    await sync1();
    expect(syncSpace.listeners).to.eql(1);
    expect(syncSpace.completed).to.eql(1);
  });

  it("an item can only be completed once", async () => {
    const syncSpace = synchroniser();
    const sync1 = syncSpace.addSynchronisation();

    await sync1();
    await sync1();
    expect(syncSpace.listeners).to.eql(1);
    expect(syncSpace.completed).to.eql(1);
  });

  it("raises an error if a sychronisation is added while the waiting on it has already started", async () => {
    const syncSpace = synchroniser();
    const sync1 = syncSpace.addSynchronisation();

    await sync1();
    expect(() => {
      syncSpace.addSynchronisation();
    }).to.throw("Synchronisation already started");
  });

  it("will resolve each one after they are all called", async () => {
    const syncSpace = synchroniser();
    const sync1 = syncSpace.addSynchronisation();
    const sync2 = syncSpace.addSynchronisation();
    let p1Complete = false;
    let p2Complete = false;

    sync1().then(() => {
      p1Complete = true;
    });
    await delay(2);
    expect(syncSpace.listeners).to.eql(2);
    expect(syncSpace.completed).to.eql(1);
    expect(p1Complete).to.eql(false);

    await sync2().then(() => {
      p2Complete = true;
    });

    expect(syncSpace.listeners).to.eql(2);
    expect(syncSpace.completed).to.eql(2);
    expect(p1Complete).to.eql(true);
    expect(p2Complete).to.eql(true);
  });
});
