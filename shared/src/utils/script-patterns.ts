export interface FieldPatterns { trigger: RegExp[]; read: RegExp[]; write: RegExp[]; reference: RegExp[]; }
function escapeRegex(str: string): string { return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
export function buildFieldPatterns(column: string): FieldPatterns {
  const col = escapeRegex(column);
  return {
    trigger: [ new RegExp(`current\\.${col}\\.changes\\(\\)`, "gi"), new RegExp(`previous\\.${col}`, "gi"), new RegExp(`changesFrom|changesTo`, "gi"), new RegExp(`${col}(=|!=|LIKE|STARTSWITH|ENDSWITH|IN|NOTIN|ISEMPTY|ISNOTEMPTY|CHANGES)`, "gi") ],
    read: [ new RegExp(`current\\.${col}(\\.toString\\(\\)|\\.getDisplayValue\\(\\)|\\.nil\\(\\)|\\.getRefRecord\\(\\))?(?!\\s*=(?!=))`, "gi"), new RegExp(`getValue\\(\\s*['"]${col}['"]\\s*\\)`, "gi"), new RegExp(`getDisplayValue\\(\\s*['"]${col}['"]\\s*\\)`, "gi"), new RegExp(`g_form\\.getValue\\(\\s*['"]${col}['"]\\s*\\)`, "gi"), new RegExp(`g_form\\.getReference\\(\\s*['"]${col}['"]`, "gi"), new RegExp(`g_form\\.getDisplayValue\\(\\s*['"]${col}['"]\\s*\\)`, "gi"), new RegExp(`addQuery\\(\\s*['"]${col}['"]`, "gi"), new RegExp(`addEncodedQuery\\([^)]*${col}`, "gi"), new RegExp(`\\.${col}\\.`, "gi") ],
    write: [ new RegExp(`current\\.${col}\\s*=(?!=)`, "gi"), new RegExp(`setValue\\(\\s*['"]${col}['"]`, "gi"), new RegExp(`g_form\\.setValue\\(\\s*['"]${col}['"]`, "gi"), new RegExp(`g_form\\.clearValue\\(\\s*['"]${col}['"]\\s*\\)`, "gi") ],
    reference: [ new RegExp(`['"]${col}['"]`, "gi"), new RegExp(`\\.${col}(?![a-zA-Z0-9_])`, "gi"), new RegExp(`field_name.*${col}`, "gi") ],
  };
}
export function findPatternMatches(script: string, pattern: RegExp): { match: string; lineNumber: number }[] {
  const results: { match: string; lineNumber: number }[] = [];
  const lines = script.split("\n");
  for (let i = 0; i < lines.length; i++) { const line = lines[i]; pattern.lastIndex = 0; let m = pattern.exec(line); while (m) { results.push({ match: m[0], lineNumber: i + 1 }); if (!pattern.global) break; m = pattern.exec(line); } }
  return results;
}
