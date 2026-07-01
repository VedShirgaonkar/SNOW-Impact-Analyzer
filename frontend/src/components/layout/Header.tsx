import { useEffect, useState, useCallback } from "react";
import { fetchStatus } from "../../services/api.js"; import type { InstanceStatus } from "../../types/index.js"; import "./Header.css";
interface HeaderProps { title: string; subtitle?: string; }
const STATUS_CONFIG = { connected: { dot: "status-connected", label: "Connected" }, auth_failed: { dot: "status-auth-failed", label: "Auth Failed" }, disconnected: { dot: "status-disconnected", label: "Disconnected" }, error: { dot: "status-disconnected", label: "Error" }, checking: { dot: "status-checking", label: "Checking..." } };
export function Header({ title, subtitle }: HeaderProps) {
  const [status, setStatus] = useState<InstanceStatus | null>(null); const [checking, setChecking] = useState(true);
  const checkStatus = useCallback(async () => { setChecking(true); try { setStatus(await fetchStatus()); } catch { setStatus(null); } setChecking(false); }, []);
  useEffect(() => { checkStatus(); }, [checkStatus]);
  useEffect(() => { const interval = setInterval(checkStatus, 30_000); return () => clearInterval(interval); }, [checkStatus]);
  const currentStatus = checking ? "checking" : (status?.status ?? "error");
  const cfg = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.error;
  return (<header className="header"><div className="header-content"><h1 className="header-title">{title}</h1>{subtitle && <span className="header-subtitle">{subtitle}</span>}</div><div className="header-status-area"><button className="header-refresh-btn" onClick={checkStatus} disabled={checking} title="Refresh">↻</button><div className={`header-instance-pill ${currentStatus}`} title={status?.error ?? cfg.label}><span className={`status-dot ${cfg.dot}`} /><span className="header-instance-name">{status?.instanceName ?? "Unknown"}</span><span className="header-status-label">{cfg.label}</span>{status?.latencyMs && currentStatus === "connected" ? <span className="header-latency">{status.latencyMs}ms</span> : null}</div></div></header>);
}
