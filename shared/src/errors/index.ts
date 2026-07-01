export class AppError extends Error {
  public readonly code: string; public readonly statusCode: number; public readonly context?: Record<string, unknown>;
  constructor(message: string, code: string, statusCode: number = 500, context?: Record<string, unknown>) {
    super(message); this.name = "AppError"; this.code = code; this.statusCode = statusCode; this.context = context; Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ConfigurationError extends AppError { constructor(message: string, context?: Record<string, unknown>) { super(message, "CONFIGURATION_ERROR", 500, context); this.name = "ConfigurationError"; } }
export class ServiceNowApiError extends AppError { constructor(message: string, statusCode: number = 502, context?: Record<string, unknown>) { super(message, "SERVICENOW_API_ERROR", statusCode, context); this.name = "ServiceNowApiError"; } }
export class ValidationError extends AppError { constructor(message: string, context?: Record<string, unknown>) { super(message, "VALIDATION_ERROR", 400, context); this.name = "ValidationError"; } }
export class CollectorError extends AppError { constructor(message: string, context?: Record<string, unknown>) { super(message, "COLLECTOR_ERROR", 500, context); this.name = "CollectorError"; } }
export class ClassificationError extends AppError { constructor(message: string, context?: Record<string, unknown>) { super(message, "CLASSIFICATION_ERROR", 500, context); this.name = "ClassificationError"; } }
export function formatErrorMessage(error: unknown): string { if (error instanceof AppError) return `[${error.code}] ${error.message}`; if (error instanceof Error) return error.message; return String(error); }
