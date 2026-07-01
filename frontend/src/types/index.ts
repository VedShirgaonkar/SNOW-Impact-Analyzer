export type Classification = "TRIGGER" | "READ" | "WRITE" | "REFERENCE";
export interface ClassificationResult { classification: Classification; evidence: string; lineNumber?: number; }
export type MetadataType = "business_rule" | "client_script" | "ui_policy" | "script_include";
export interface ImpactResultEntry { sys_id: string; name: string; active: boolean; description: string; type: MetadataType; classifications: ClassificationResult[]; extra: Record<string, unknown>; }
export interface ImpactSummary { total_references: number; by_type: { business_rules: number; client_scripts: number; ui_policies: number; script_includes: number; }; by_classification: Record<Classification, number>; }
export interface ImpactResult { field: string; table: string; column: string; timestamp: string; summary: ImpactSummary; results: { business_rules: ImpactResultEntry[]; client_scripts: ImpactResultEntry[]; ui_policies: ImpactResultEntry[]; script_includes: ImpactResultEntry[]; }; }
export interface AnalyzeResponse { success: boolean; data: ImpactResult; markdown: string; meta: { durationMs: number; timestamp: string; }; }
export interface ApiError { error: string; message: string; code: string; }
export interface InstanceStatus { instanceUrl: string; instanceName: string; reachable: boolean; authenticated: boolean; latencyMs: number; error: string | null; status: "connected" | "auth_failed" | "disconnected" | "error"; }
export interface NavItem { id: string; label: string; icon: string; active: boolean; comingSoon?: boolean; }
