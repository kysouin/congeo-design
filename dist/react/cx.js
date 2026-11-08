"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cx = cx;
/** Joins class names, dropping falsy values. */
function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}
