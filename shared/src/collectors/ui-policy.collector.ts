import { BaseCollector } from "./base-collector.js";
import type { FieldInput, MetadataRecord, MetadataType } from "../types/index.js";
export class UIPolicyCollector extends BaseCollector {
  protected get tableName(): string { return "sys_ui_policy"; }
  protected get metadataType(): MetadataType { return "ui_policy"; }
  protected get queryFields(): string[] { return ["sys_id","short_description","table","active","script_true","script_false","description","conditions","on_load","reverse_if_false","run_scripts"]; }
  protected buildQuery(field: FieldInput): string { return [`table=${field.table}`,`active=true`,`conditionsLIKE${field.column}^ORscript_trueLIKE${field.column}^ORscript_falseLIKE${field.column}`].join("^"); }
  protected mapRecord(raw: Record<string, unknown>, _field: FieldInput): MetadataRecord {
    const scriptTrue = String(raw["script_true"]??""); const scriptFalse = String(raw["script_false"]??""); const conditions = String(raw["conditions"]??"");
    const combinedScript = [`// Conditions: ${conditions}`,"// script_true:",scriptTrue,"// script_false:",scriptFalse].join("\n");
    return { sys_id: String(raw["sys_id"]??""), name: String(raw["short_description"]??""), table: String(raw["table"]??""), active: raw["active"]==="true"||raw["active"]===true, script: combinedScript, description: String(raw["description"]??""), type: "ui_policy",
      extra: { conditions, on_load: raw["on_load"]==="true"||raw["on_load"]===true, reverse_if_false: raw["reverse_if_false"]==="true"||raw["reverse_if_false"]===true, run_scripts: raw["run_scripts"]==="true"||raw["run_scripts"]===true, script_true: scriptTrue, script_false: scriptFalse } };
  }
}
