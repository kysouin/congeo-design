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
exports.FilterPill = void 0;
exports.FilterPills = FilterPills;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_js_1 = require("./cx.js");
const types_js_1 = require("./types.js");
/** Filter pill with a dot and a count. Toggle via aria-pressed. */
exports.FilterPill = React.forwardRef(function FilterPill({ active, dot, count, className, children, type = 'button', ...rest }, ref) {
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, type: type, "aria-pressed": !!active, className: (0, cx_js_1.cx)('cg-pill', className), ...(0, types_js_1.accentAttrs)(dot), ...rest, children: [dot && (0, jsx_runtime_1.jsx)("span", { className: "cg-pill__dot", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "cg-pill__label", children: children }), count != null && (0, jsx_runtime_1.jsx)("span", { className: "cg-pill__count", children: count })] }));
});
function FilterPills({ className, ...rest }) {
    return (0, jsx_runtime_1.jsx)("div", { className: (0, cx_js_1.cx)('cg-pills', className), ...rest });
}
