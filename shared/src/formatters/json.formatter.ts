import type { ImpactResult } from "../types/index.js";
export function formatAsJson(result: ImpactResult): string { return JSON.stringify(result, null, 2); }
