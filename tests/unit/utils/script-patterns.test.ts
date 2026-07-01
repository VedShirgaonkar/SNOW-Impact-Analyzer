import { describe, it, expect } from "vitest";
import { buildFieldPatterns, findPatternMatches } from "../../shared/src/utils/script-patterns.js";
describe("buildFieldPatterns", () => { it("returns all arrays", () => { const p = buildFieldPatterns("assignment_group"); expect(p.trigger.length).toBeGreaterThan(0); }); });
describe("findPatternMatches", () => {
  it("finds .changes()", () => { expect(findPatternMatches("current.assignment_group.changes()", buildFieldPatterns("assignment_group").trigger[0]).length).toBeGreaterThan(0); });
  it("finds getValue", () => { const p = buildFieldPatterns("assignment_group").read.find((p) => p.source.includes("getValue")); expect(findPatternMatches("current.getValue('assignment_group')", p!).length).toBeGreaterThan(0); });
  it("finds setValue", () => { const p = buildFieldPatterns("assignment_group").write.find((p) => p.source.includes("setValue")); expect(findPatternMatches("current.setValue('assignment_group', v)", p!).length).toBeGreaterThan(0); });
  it("correct line numbers", () => { expect(findPatternMatches("// 1\n// 2\ncurrent.assignment_group = v;", buildFieldPatterns("assignment_group").write[0])[0].lineNumber).toBe(3); });
  it("empty when no match", () => { expect(findPatternMatches("var x = 1;", buildFieldPatterns("assignment_group").trigger[0])).toEqual([]); });
});
