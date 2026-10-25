import { describe, expect, it } from "vitest";
import { compareRuns } from "../src/domain/engine.js";
describe("run comparison", () => {
  it("tolerates insignificant floating point drift", () => { expect(compareRuns({runId:"a",outputs:{table:"h1"},metrics:{score:1}},{runId:"b",outputs:{table:"h1"},metrics:{score:1.000000001}},1e-6).equivalent).toBe(true); });
  it("reports changed artifacts and missing metrics", () => { const result=compareRuns({runId:"a",outputs:{plot:"old"},metrics:{score:1}},{runId:"b",outputs:{plot:"new"},metrics:{}}); expect(result.changedOutputs).toEqual(["plot"]); expect(result.metricDeltas[0]?.name).toBe("score"); });
});