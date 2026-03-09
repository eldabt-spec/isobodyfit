/**
 * Shared helpers for narrowing Express 5 request values.
 *
 * Express 5 types req.params values as `string | string[]` and
 * req.query values as `string | string[] | ParsedQs | ParsedQs[] | undefined`.
 * These helpers always resolve to a plain `string | undefined`.
 */

/** Extract a single string from a route param (e.g. req.params['id']). */
export function param(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

/** Extract a single string from a query value (e.g. req.query['page']). */
export function queryStr(val: unknown): string | undefined {
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0] as string;
  return undefined;
}
