import { ValidationError } from "../errors/index.js";
import type { FieldInput } from "../types/index.js";
export function parseField(raw: string): FieldInput {
  if (!raw || typeof raw !== "string") throw new ValidationError("Field reference must be a non-empty string.");
  const trimmed = raw.trim();
  if (!trimmed.includes(".")) throw new ValidationError(`Invalid field reference "${trimmed}". Expected format: table.column (e.g. incident.assignment_group).`);
  const dotIndex = trimmed.indexOf(".");
  const table = trimmed.substring(0, dotIndex);
  const column = trimmed.substring(dotIndex + 1);
  if (!table || !column) throw new ValidationError(`Invalid field reference "${trimmed}". Both table and column must be non-empty.`);
  const validPattern = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;
  if (!validPattern.test(table)) throw new ValidationError(`Invalid table name "${table}". Must start with a letter or underscore and contain only alphanumeric characters and underscores.`);
  if (!validPattern.test(column)) throw new ValidationError(`Invalid column name "${column}". Must start with a letter or underscore and contain only alphanumeric characters, underscores, and dots.`);
  return { table, column, raw: trimmed };
}
