import { describe, it, expect } from "vitest";
import { parseField } from "../../shared/src/utils/field-parser.js";
describe("parseField", () => {
  it("parses simple ref", () => { expect(parseField("incident.assignment_group")).toEqual({ table: "incident", column: "assignment_group", raw: "incident.assignment_group" }); });
  it("parses dot-walked", () => { expect(parseField("incident.caller_id.department").column).toBe("caller_id.department"); });
  it("trims whitespace", () => { expect(parseField("  incident.state  ").raw).toBe("incident.state"); });
  it("throws on empty", () => { expect(() => parseField("")).toThrow("non-empty"); });
  it("throws on no dot", () => { expect(() => parseField("incident")).toThrow("Expected format"); });
  it("throws on empty table", () => { expect(() => parseField(".field")).toThrow("Both table and column"); });
  it("throws on invalid chars", () => { expect(() => parseField("inci-dent.field")).toThrow("Invalid table name"); });
  it("throws on non-string", () => { expect(() => parseField(null as unknown as string)).toThrow("non-empty"); });
});
