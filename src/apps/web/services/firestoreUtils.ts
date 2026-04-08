export function parseTimestamp(input: unknown): Date | undefined {
  if (!input || typeof input !== "object") return undefined;
  const value = input as { toDate?: () => Date };
  return typeof value.toDate === "function" ? value.toDate() : undefined;
}
