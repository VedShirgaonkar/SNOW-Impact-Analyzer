import { ServiceNowClient } from "../servicenow/client.js";
import { BusinessRuleCollector } from "../collectors/business-rule.collector.js";
import { ClientScriptCollector } from "../collectors/client-script.collector.js";
import { UIPolicyCollector } from "../collectors/ui-policy.collector.js";
import { ScriptIncludeCollector } from "../collectors/script-include.collector.js";
import { Classifier } from "./classifier.js";
import { logger } from "../logging/logger.js";
import type { Classification, CollectorResult, FieldInput, ImpactResult, ImpactResultEntry } from "../types/index.js";

export class ImpactAnalyzer {
  private readonly client: ServiceNowClient;
  private readonly classifier: Classifier;
  constructor(client: ServiceNowClient) { this.client = client; this.classifier = new Classifier(); }

  async analyze(field: FieldInput): Promise<ImpactResult> {
    logger.info("Starting impact analysis", { field: field.raw });
    const collectors = [new BusinessRuleCollector(this.client), new ClientScriptCollector(this.client), new UIPolicyCollector(this.client), new ScriptIncludeCollector(this.client)];
    const collectorResults = await Promise.all(collectors.map((c) => c.collect(field)));
    for (const result of collectorResults) for (const ref of result.references) ref.classifications = this.classifier.classify(ref.record, field);
    for (const result of collectorResults) result.references = result.references.filter((ref) => ref.classifications.length > 0);
    const allErrors = collectorResults.flatMap((r) => r.errors);
    if (allErrors.length > 0) logger.warn("Collector errors", { errors: allErrors });
    return this.buildResult(field, collectorResults);
  }

  private buildResult(field: FieldInput, collectorResults: CollectorResult[]): ImpactResult {
    const br = this.mapEntries(collectorResults, "business_rule"); const cs = this.mapEntries(collectorResults, "client_script");
    const up = this.mapEntries(collectorResults, "ui_policy"); const si = this.mapEntries(collectorResults, "script_include");
    const all = [...br, ...cs, ...up, ...si];
    const byClassification: Record<Classification, number> = { TRIGGER: 0, READ: 0, WRITE: 0, REFERENCE: 0 };
    for (const entry of all) for (const c of entry.classifications) byClassification[c.classification]++;
    return { field: field.raw, table: field.table, column: field.column, timestamp: new Date().toISOString(),
      summary: { total_references: all.length, by_type: { business_rules: br.length, client_scripts: cs.length, ui_policies: up.length, script_includes: si.length }, by_classification: byClassification },
      results: { business_rules: br, client_scripts: cs, ui_policies: up, script_includes: si } };
  }

  private mapEntries(collectorResults: CollectorResult[], type: string): ImpactResultEntry[] {
    const result = collectorResults.find((r) => r.type === type); if (!result) return [];
    return result.references.map((ref) => ({ sys_id: ref.record.sys_id, name: ref.record.name, active: ref.record.active, description: ref.record.description ?? "", type: ref.record.type, classifications: ref.classifications, extra: ref.record.extra }));
  }
}
