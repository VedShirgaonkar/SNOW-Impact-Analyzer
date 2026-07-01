import { BaseCollector } from "./base-collector.js";
import type { FieldInput, MetadataRecord, MetadataType } from "../types/index.js";
export class ScriptIncludeCollector extends BaseCollector {
  protected get tableName(): string { return "sys_script_include"; }
  protected get metadataType(): MetadataType { return "script_include"; }
  protected get queryFields(): string[] { return ["sys_id","name","active","script","description","api_name","client_callable","access"]; }
  protected buildQuery(field: FieldInput): string { return [`active=true`,`scriptLIKE${field.column}`,`scriptLIKE${field.table}`].join("^"); }
  protected mapRecord(raw: Record<string, unknown>, _field: FieldInput): MetadataRecord { return { sys_id: String(raw["sys_id"]??""), name: String(raw["name"]??""), table: "", active: raw["active"]==="true"||raw["active"]===true, script: String(raw["script"]??""), description: String(raw["description"]??""), type: "script_include", extra: { api_name: String(raw["api_name"]??""), client_callable: raw["client_callable"]==="true"||raw["client_callable"]===true, access: String(raw["access"]??"") } }; }
}
