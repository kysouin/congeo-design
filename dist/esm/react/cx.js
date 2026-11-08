/** Joins class names, dropping falsy values. */
export function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
