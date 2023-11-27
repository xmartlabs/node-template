/**
 * Returns a unique postgres schema name for the current jest worker.
 */
export function buildUniquePgSchemaName(): string {
  const workerId = process.env.JEST_WORKER_ID;
  if (!workerId) {
    throw new Error("Missing 'JEST_WORKER_ID_ENV'.");
  }
  return `jest-${workerId}`;
}
