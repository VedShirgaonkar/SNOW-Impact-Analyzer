import { useState, useCallback } from "react";
import type { AnalyzeResponse } from "../types/index.js";
import { analyzeField, AnalysisError } from "../services/api.js";
interface UseAnalysisState { result: AnalyzeResponse | null; loading: boolean; error: string | null; errorCode: string | null; }
export function useAnalysis(): UseAnalysisState & { analyze: (field: string) => Promise<void>; clear: () => void } {
  const [state, setState] = useState<UseAnalysisState>({ result: null, loading: false, error: null, errorCode: null });
  const analyze = useCallback(async (field: string) => { setState({ result: null, loading: true, error: null, errorCode: null }); try { const result = await analyzeField(field); setState({ result, loading: false, error: null, errorCode: null }); } catch (err) { setState({ result: null, loading: false, error: err instanceof AnalysisError ? err.message : err instanceof Error ? err.message : "An unexpected error occurred.", errorCode: err instanceof AnalysisError ? err.code : "UNKNOWN_ERROR" }); } }, []);
  const clear = useCallback(() => { setState({ result: null, loading: false, error: null, errorCode: null }); }, []);
  return { ...state, analyze, clear };
}
