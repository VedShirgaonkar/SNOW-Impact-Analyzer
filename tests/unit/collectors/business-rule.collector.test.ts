import { describe, it, expect, vi, beforeEach } from "vitest";
import { BusinessRuleCollector } from "../../shared/src/collectors/business-rule.collector.js";
import { ServiceNowClient } from "../../shared/src/servicenow/client.js";
import type { FieldInput, ServiceNowConfig } from "../../shared/src/types/index.js";
const cfg: ServiceNowConfig = { instanceUrl: "https://test.service-now.com", username: "admin", password: "pass" };
const field: FieldInput = { table: "incident", column: "assignment_group", raw: "incident.assignment_group" };
describe("BusinessRuleCollector", () => {
  let client: ServiceNowClient; let collector: BusinessRuleCollector;
  beforeEach(() => { client = new ServiceNowClient(cfg); collector = new BusinessRuleCollector(client); });
  it("correct type", async () => { vi.spyOn(client, "query").mockResolvedValue([]); expect((await collector.collect(field)).type).toBe("business_rule"); });
  it("handles errors", async () => { vi.spyOn(client, "query").mockRejectedValue(new Error("fail")); expect((await collector.collect(field)).errors.length).toBeGreaterThan(0); });
});
