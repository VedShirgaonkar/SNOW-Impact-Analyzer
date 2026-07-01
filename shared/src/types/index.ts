export type Classification = "TRIGGER" | "READ" | "WRITE" | "REFERENCE";
export interface ClassificationResult { classification: Classification; evidence: string; lineNumber?: number; }
export type MetadataType = "business_rule" | "client_script" | "ui_policy" | "script_include";
export interface MetadataRecord { sys_id: string; name: string; table: string; active: boolean; script: string; description?: string; type: MetadataType; extra: Record<string, unknown>; }
export interface FieldReference { record: MetadataRecord; classifications: ClassificationResult[]; }
export interface CollectorResult { type: MetadataType; references: FieldReference[]; errors: string[]; }
export interface FieldInput { table: string; column: string; raw: string; }
export interface ImpactSummary { total_references: number; by_type: { business_rules: number; client_scripts: number; ui_policies: number; script_includes: number; }; by_classification: Record<Classification, number>; }
export interface ImpactResultEntry { sys_id: string; name: string; active: boolean; description: string; type: MetadataType; classifications: ClassificationResult[]; extra: Record<string, unknown>; }
export interface ImpactResult { field: string; table: string; column: string; timestamp: string; summary: ImpactSummary; results: { business_rules: ImpactResultEntry[]; client_scripts: ImpactResultEntry[]; ui_policies: ImpactResultEntry[]; script_includes: ImpactResultEntry[]; }; }
export interface McpToolDefinition { name: string; description: string; inputSchema: Record<string, unknown>; }
export interface McpToolResponse { content: Array<{ type: "text"; text: string }>; isError?: boolean; }
export interface McpTool { definition: McpToolDefinition; handler: (args: Record<string, unknown>) => Promise<McpToolResponse>; }
export interface ServiceNowConfig { instanceUrl: string; username: string; password: string; }
export interface ServiceNowQueryParams { table: string; query: string; fields: string[]; limit?: number; }
export interface ServiceNowResponse<T = Record<string, unknown>> { result: T[]; }
export type LogLevel = "debug" | "info" | "warn" | "error";
export interface LogEntry { level: LogLevel; message: string; timestamp: string; context?: Record<string, unknown>; }
