import { describe, it, expect } from "vitest";
import { formatAsJson } from "../../shared/src/formatters/json.formatter.js";
import { sampleImpactResult, sampleEmptyImpactResult } from "../fixtures/sample-metadata.js";
describe("formatAsJson", () => {
  it("valid JSON", () => { expect(JSON.parse(formatAsJson(sampleImpactResult)).field).toBe("incident.assignment_group"); });
  it("preserves fields", () => { const p = JSON.parse(formatAsJson(sampleImpactResult)); expect(p.table).toBe("incident"); expect(p.summary).toBeDefined(); });
  it("summary counts", () => { expect(JSON.parse(formatAsJson(sampleImpactResult)).summary.total_references).toBe(4); });
  it("empty results", () => { expect(JSON.parse(formatAsJson(sampleEmptyImpactResult)).summary.total_references).toBe(0); });
});
