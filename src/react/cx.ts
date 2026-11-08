export type ClassValue = string | false | null | undefined | 0;
/** Joins class names, dropping falsy values. */
export function cx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}
