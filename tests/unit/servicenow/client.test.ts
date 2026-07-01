import { describe, it, expect } from "vitest";
import { ServiceNowClient } from "../../shared/src/servicenow/client.js";
import type { ServiceNowConfig } from "../../shared/src/types/index.js";
const cfg: ServiceNowConfig = { instanceUrl: "https://test.service-now.com", username: "admin", password: "pass" };
describe("ServiceNowClient", () => {
  it("constructs", () => { expect(new ServiceNowClient(cfg)).toBeDefined(); });
  it("returns URL", () => { expect(new ServiceNowClient(cfg).getInstanceUrl()).toBe("https://test.service-now.com"); });
  it("has ping method", () => { expect(typeof new ServiceNowClient(cfg).ping).toBe("function"); });
});
