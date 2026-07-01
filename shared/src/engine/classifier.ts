import { buildFieldPatterns, findPatternMatches } from "../utils/script-patterns.js";
import { logger } from "../logging/logger.js";
import type { Classification, ClassificationResult, MetadataRecord, FieldInput } from "../types/index.js";
export class Classifier {
  classify(record: MetadataRecord, field: FieldInput): ClassificationResult[] {
    const results: ClassificationResult[] = []; const script = record.script;
    if (!script || script.trim().length === 0) return results;
    const patterns = buildFieldPatterns(field.column);
    results.push(...this.matchPatterns(script, patterns.trigger, "TRIGGER"));
    results.push(...this.matchPatterns(script, patterns.write, "WRITE"));
    results.push(...this.matchPatterns(script, patterns.read, "READ"));
    if (results.length === 0) results.push(...this.matchPatterns(script, patterns.reference, "REFERENCE"));
    const deduped = this.deduplicateByClassification(results);
    logger.debug("Classification complete", { record: record.name, classifications: deduped.map((r) => r.classification) });
    return deduped;
  }
  private matchPatterns(script: string, patterns: RegExp[], classification: Classification): ClassificationResult[] {
    const results: ClassificationResult[] = [];
    for (const pattern of patterns) { for (const match of findPatternMatches(script, pattern)) results.push({ classification, evidence: match.match, lineNumber: match.lineNumber }); }
    return results;
  }
  private deduplicateByClassification(results: ClassificationResult[]): ClassificationResult[] {
    const seen = new Map<Classification, ClassificationResult>();
    for (const r of results) if (!seen.has(r.classification)) seen.set(r.classification, r);
    return Array.from(seen.values());
  }
}
