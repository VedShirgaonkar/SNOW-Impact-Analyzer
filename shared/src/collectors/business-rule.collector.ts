import { BaseCollector } from "./base-collector.js";
import type { FieldInput, MetadataRecord, MetadataType } from "../types/index.js";
export class BusinessRuleCollector extends BaseCollector {
  protected get tableName(): string { return "sys_script"; }
  protected get metadataType(): MetadataType { return "business_rule"; }
  protected get queryFields(): string[] { return ["sys_id","name","collection","active","script","description","when","order","filter_condition","action_insert","action_update","action_delete","action_query"]; }
  protected buildQuery(field: FieldInput): string { return [`collection=${field.table}`,`active=true`,`scriptLIKE${field.column}^ORfilter_conditionLIKE${field.column}`].join("^"); }
  protected mapRecord(raw: Record<string, unknown>, _field: FieldInput): MetadataRecord { return { sys_id: String(raw["sys_id"]??""), name: String(raw["name"]??""), table: String(raw["collection"]??""), active: raw["active"]==="true"||raw["active"]===true, script: String(raw["script"]??""), description: String(raw["description"]??""), type: "business_rule", extra: { when: String(raw["when"]??""), order: String(raw["order"]??""), filter_condition: String(raw["filter_condition"]??""), action_insert: raw["action_insert"]==="true"||raw["action_insert"]===true, action_update: raw["action_update"]==="true"||raw["action_update"]===true, action_delete: raw["action_delete"]==="true"||raw["action_delete"]===true, action_query: raw["action_query"]==="true"||raw["action_query"]===true } }; }
}
