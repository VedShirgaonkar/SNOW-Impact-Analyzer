import axios, { AxiosInstance, AxiosError } from "axios";
import { ServiceNowApiError } from "../errors/index.js";
import { logger } from "../logging/logger.js";
import type { ServiceNowConfig, ServiceNowQueryParams, ServiceNowResponse } from "../types/index.js";

export class ServiceNowClient {
  private readonly http: AxiosInstance;
  private readonly baseUrl: string;
  constructor(config: ServiceNowConfig) {
    this.baseUrl = config.instanceUrl;
    this.http = axios.create({ baseURL: `${config.instanceUrl}/api/now`, auth: { username: config.username, password: config.password }, headers: { Accept: "application/json", "Content-Type": "application/json" }, timeout: 30_000 });
    logger.info("ServiceNow client initialized", { instanceUrl: config.instanceUrl });
  }
  async query<T = Record<string, unknown>>(params: ServiceNowQueryParams): Promise<T[]> {
    const { table, query, fields, limit = 100 } = params;
    logger.debug("Querying ServiceNow table", { table, query, fields: fields.join(","), limit });
    try {
      const response = await this.http.get<ServiceNowResponse<T>>(`/table/${table}`, { params: { sysparm_query: query, sysparm_fields: fields.join(","), sysparm_limit: limit, sysparm_display_value: "false" } });
      logger.debug("ServiceNow query returned results", { table, count: response.data.result.length });
      return response.data.result;
    } catch (error) {
      if (error instanceof AxiosError) { const status = error.response?.status ?? 0; const message = error.response?.data?.error?.message ?? error.message; logger.error("ServiceNow API request failed", { table, status, message }); throw new ServiceNowApiError(`ServiceNow API error (HTTP ${status}): ${message}`, status >= 400 && status < 500 ? status : 502, { table, query, status }); }
      throw error;
    }
  }
  async ping(): Promise<{ reachable: boolean; authenticated: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      const response = await this.http.get("/table/sys_properties", { params: { sysparm_query: "name=glide.product.name", sysparm_fields: "name,value", sysparm_limit: 1 }, timeout: 10_000 });
      const latencyMs = Date.now() - start;
      if (response.status === 200) return { reachable: true, authenticated: true, latencyMs };
      return { reachable: true, authenticated: false, latencyMs, error: `Unexpected status: ${response.status}` };
    } catch (error) {
      const latencyMs = Date.now() - start;
      if (error instanceof AxiosError) {
        const status = error.response?.status ?? 0;
        if (status === 401 || status === 403) return { reachable: true, authenticated: false, latencyMs, error: "Authentication failed. Check your ServiceNow username and password." };
        if (error.code === "ECONNREFUSED") return { reachable: false, authenticated: false, latencyMs, error: "Connection refused." };
        if (error.code === "ENOTFOUND") return { reachable: false, authenticated: false, latencyMs, error: "Instance not found. Check the URL." };
        if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") return { reachable: false, authenticated: false, latencyMs, error: "Connection timed out. Instance may be hibernating." };
        const msg = error.response?.data?.error?.message ?? error.message;
        return { reachable: status > 0, authenticated: false, latencyMs, error: `HTTP ${status}: ${msg}` };
      }
      return { reachable: false, authenticated: false, latencyMs, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
  getInstanceUrl(): string { return this.baseUrl; }
}
