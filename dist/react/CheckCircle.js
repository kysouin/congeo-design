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
exports.CheckCircle = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_js_1 = require("./cx.js");
const core_js_1 = require("../i18n/core.js");
/** 22 px check circle with a 44 px hit area. */
exports.CheckCircle = React.forwardRef(function CheckCircle({ checked, overdue, onChange, label, className, onClick, ...rest }, ref) {
    return ((0, jsx_runtime_1.jsx)("button", { ref: ref, type: "button", role: "checkbox", "aria-checked": checked, "aria-label": label !== null && label !== void 0 ? label : (0, core_js_1.L)('Done', 'Έγινε'), className: (0, cx_js_1.cx)('cg-check', checked && 'cg-check--checked', overdue && !checked && 'cg-check--overdue', className), onClick: (e) => {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
            if (!e.defaultPrevented)
                onChange === null || onChange === void 0 ? void 0 : onChange(!checked);
        }, ...rest, children: (0, jsx_runtime_1.jsx)("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("path", { d: "M5 12.5l4.5 4.5L19 7.5" }) }) }));
});
