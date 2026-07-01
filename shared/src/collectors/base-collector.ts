import { ServiceNowClient } from "../servicenow/client.js";
import { logger } from "../logging/logger.js";
import { CollectorError } from "../errors/index.js";
import type { CollectorResult, FieldInput, MetadataRecord, MetadataType } from "../types/index.js";
export abstract class BaseCollector {
  protected readonly client: ServiceNowClient;
  constructor(client: ServiceNowClient) { this.client = client; }
  protected abstract get tableName(): string;
  protected abstract get metadataType(): MetadataType;
  protected abstract get queryFields(): string[];
  protected buildQuery(field: FieldInput): string { return `collection=${field.table}^scriptLIKE${field.column}^active=true`; }
  protected abstract mapRecord(raw: Record<string, unknown>, field: FieldInput): MetadataRecord;
  async collect(field: FieldInput): Promise<CollectorResult> {
    const errors: string[] = []; const records: MetadataRecord[] = [];
    try {
      logger.info(`Collecting ${this.metadataType} records`, { table: field.table, column: field.column });
      const query = this.buildQuery(field);
      const rawRecords = await this.client.query<Record<string, unknown>>({ table: this.tableName, query, fields: this.queryFields, limit: 200 });
      for (const raw of rawRecords) { try { records.push(this.mapRecord(raw, field)); } catch (err) { errors.push(`Failed to map ${this.metadataType} record ${String(raw["sys_id"] ?? "unknown")}: ${err instanceof Error ? err.message : String(err)}`); } }
      logger.info(`Collected ${records.length} ${this.metadataType} records`, { errors: errors.length });
    } catch (err) { if (err instanceof CollectorError) throw err; errors.push(`${this.metadataType} collection failed: ${err instanceof Error ? err.message : String(err)}`); }
    return { type: this.metadataType, references: records.map((record) => ({ record, classifications: [] })), errors };
  }
}
