"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconButton = exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_1 = require("./cx");
exports.Button = React.forwardRef(function Button({ variant = 'secondary', size = 'md', block, className, type = 'button', ...rest }, ref) {
    return ((0, jsx_runtime_1.jsx)("button", { ref: ref, type: type, className: (0, cx_1.cx)('cg-btn', `cg-btn--${variant}`, `cg-btn--${size}`, block && 'cg-btn--block', className), ...rest }));
});
/** Round 44 px icon button. Pass a Lucide icon as the child. */
exports.IconButton = React.forwardRef(function IconButton({ variant = 'secondary', label, className, type = 'button', children, ...rest }, ref) {
    var _a;
    return ((0, jsx_runtime_1.jsx)("button", { ref: ref, type: type, "aria-label": label, title: (_a = rest.title) !== null && _a !== void 0 ? _a : label, className: (0, cx_1.cx)('cg-btn', `cg-btn--${variant}`, 'cg-btn--icon', className), ...rest, children: children }));
});
