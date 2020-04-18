import { expect } from "chai";
import scopedPromise from "../../src/lib/scopedPromise";

describe("Scoped promises", () => {
  it("returns object to build promises", async () => {
    const scope = {};
    const scoped = scopedPromise(scope);

    expect(scoped.open()).to.eql(0);
    const result = await scoped.promise(resolve => resolve(5));
    expect(result).to.eql(5);
    expect(scoped.open()).to.eql(0);
  });

  it("keeps unresolved promises", async () => {
    const scope = {};
    const scoped = scopedPromise(scope);

    expect(scoped.open()).to.eql(0);
    const p1 = scoped.promise(resolve => resolve(5));
    const p2 = scoped.promise(() => {
      /* never resolves */
    });
    const result = await Promise.race([p1, p2]);
    expect(result).to.eql(5);
    expect(scoped.open()).to.eql(1);
    expect(scoped.clean(new Error("Ended")));
    expect(scoped.open()).to.eql(0);
    let err = null;
    try {
      await p2;
    } catch (e) {
      err = e.message;
    }
    expect(err).to.eql("Ended");
  });
});
