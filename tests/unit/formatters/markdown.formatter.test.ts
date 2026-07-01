import { describe, it, expect } from "vitest";
import { formatAsMarkdown } from "../../shared/src/formatters/markdown.formatter.js";
import { sampleImpactResult, sampleEmptyImpactResult } from "../fixtures/sample-metadata.js";
describe("formatAsMarkdown", () => {
  it("includes field name", () => { expect(formatAsMarkdown(sampleImpactResult)).toContain("incident.assignment_group"); });
  it("includes summary", () => { expect(formatAsMarkdown(sampleImpactResult)).toContain("## Summary"); });
  it("includes classifications", () => { const o = formatAsMarkdown(sampleImpactResult); expect(o).toContain("TRIGGER"); expect(o).toContain("READ"); });
  it("empty message", () => { expect(formatAsMarkdown(sampleEmptyImpactResult)).toContain("No references"); });
});
