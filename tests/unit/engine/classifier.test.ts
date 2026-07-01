import { describe, it, expect } from "vitest";
import { Classifier } from "../../shared/src/engine/classifier.js";
import { sampleField, sampleBusinessRule, sampleClientScript, sampleScriptInclude } from "../fixtures/sample-metadata.js";
import type { MetadataRecord } from "../../shared/src/types/index.js";
describe("Classifier", () => {
  const c = new Classifier();
  it("detects TRIGGER", () => { expect(c.classify(sampleBusinessRule, sampleField).find((r) => r.classification === "TRIGGER")).toBeDefined(); });
  it("detects READ", () => { expect(c.classify(sampleBusinessRule, sampleField).find((r) => r.classification === "READ")).toBeDefined(); });
  it("multiple classifications", () => { expect(c.classify(sampleBusinessRule, sampleField).length).toBeGreaterThanOrEqual(2); });
  it("READ from g_form", () => { expect(c.classify(sampleClientScript, sampleField).find((r) => r.classification === "READ")).toBeDefined(); });
  it("WRITE from setValue", () => { const r: MetadataRecord = { ...sampleClientScript, script: "g_form.setValue('assignment_group', 'v');" }; expect(c.classify(r, sampleField).find((x) => x.classification === "WRITE")).toBeDefined(); });
  it("SI READ", () => { expect(c.classify(sampleScriptInclude, sampleField).find((r) => r.classification === "READ")).toBeDefined(); });
  it("SI WRITE", () => { expect(c.classify(sampleScriptInclude, sampleField).find((r) => r.classification === "WRITE")).toBeDefined(); });
  it("empty script", () => { expect(c.classify({ ...sampleBusinessRule, script: "" }, sampleField)).toEqual([]); });
  it("deduplicates", () => { const r: MetadataRecord = { ...sampleBusinessRule, script: "getValue('assignment_group');\ng_form.getValue('assignment_group');" }; expect(c.classify(r, sampleField).filter((x) => x.classification === "READ").length).toBe(1); });
});
