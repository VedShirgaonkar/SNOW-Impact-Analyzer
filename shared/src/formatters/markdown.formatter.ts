import type { Classification, ImpactResult, ImpactResultEntry } from "../types/index.js";
const EMOJI: Record<Classification, string> = { TRIGGER: "⚡", READ: "📖", WRITE: "✏️", REFERENCE: "🔗" };
export function formatAsMarkdown(result: ImpactResult): string {
  const l: string[] = [];
  l.push(`# Impact Analysis: \`${result.field}\``, "", `**Table:** ${result.table}`, `**Column:** ${result.column}`, `**Analyzed:** ${result.timestamp}`, "");
  l.push("## Summary", "", "| Metric | Count |", "|--------|-------|");
  l.push(`| Total References | ${result.summary.total_references} |`, `| Business Rules | ${result.summary.by_type.business_rules} |`, `| Client Scripts | ${result.summary.by_type.client_scripts} |`, `| UI Policies | ${result.summary.by_type.ui_policies} |`, `| Script Includes | ${result.summary.by_type.script_includes} |`, "");
  l.push("### By Classification", "", "| Classification | Count |", "|----------------|-------|");
  for (const [cls, count] of Object.entries(result.summary.by_classification)) l.push(`| ${EMOJI[cls as Classification] ?? ""} ${cls} | ${count} |`);
  l.push("");
  if (result.results.business_rules.length > 0) l.push("## Business Rules", "", ...fmtEntries(result.results.business_rules));
  if (result.results.client_scripts.length > 0) l.push("## Client Scripts", "", ...fmtEntries(result.results.client_scripts));
  if (result.results.ui_policies.length > 0) l.push("## UI Policies", "", ...fmtEntries(result.results.ui_policies));
  if (result.results.script_includes.length > 0) l.push("## Script Includes", "", ...fmtEntries(result.results.script_includes));
  if (result.summary.total_references === 0) l.push("## Results", "", "No references to this field were found in any analyzed metadata.", "");
  return l.join("\n");
}
function fmtEntries(entries: ImpactResultEntry[]): string[] {
  const l: string[] = [];
  for (const e of entries) { l.push(`### ${e.name}`, "", `- **sys_id:** \`${e.sys_id}\``, `- **Active:** ${e.active ? "Yes" : "No"}`); if (e.description) l.push(`- **Description:** ${e.description}`); for (const [k, v] of Object.entries(e.extra)) { if (v !== "" && v != null) l.push(`- **${fmtKey(k)}:** ${String(v)}`); } l.push("", "**Classifications:**", ""); for (const c of e.classifications) { const li = c.lineNumber ? ` (line ${c.lineNumber})` : ""; l.push(`- ${EMOJI[c.classification] ?? ""} **${c.classification}**${li}: \`${c.evidence}\``); } l.push("", "---", ""); }
  return l;
}
function fmtKey(key: string): string { return key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "); }
