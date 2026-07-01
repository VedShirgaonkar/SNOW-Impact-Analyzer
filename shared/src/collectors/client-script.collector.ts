import { BaseCollector } from "./base-collector.js";
import type { FieldInput, MetadataRecord, MetadataType } from "../types/index.js";
export class ClientScriptCollector extends BaseCollector {
  protected get tableName(): string { return "sys_script_client"; }
  protected get metadataType(): MetadataType { return "client_script"; }
  protected get queryFields(): string[] { return ["sys_id","name","table","active","script","description","type","ui_type","field_name"]; }
  protected buildQuery(field: FieldInput): string { return [`table=${field.table}`,`active=true`,`scriptLIKE${field.column}^ORfield_name=${field.column}`].join("^"); }
  protected mapRecord(raw: Record<string, unknown>, _field: FieldInput): MetadataRecord { return { sys_id: String(raw["sys_id"]??""), name: String(raw["name"]??""), table: String(raw["table"]??""), active: raw["active"]==="true"||raw["active"]===true, script: String(raw["script"]??""), description: String(raw["description"]??""), type: "client_script", extra: { script_type: String(raw["type"]??""), ui_type: String(raw["ui_type"]??""), field_name: String(raw["field_name"]??"") } }; }
}
