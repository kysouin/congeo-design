export type ClassValue = string | false | null | undefined | 0;
/** Joins class names, dropping falsy values. */
export declare function cx(...parts: ClassValue[]): string;
