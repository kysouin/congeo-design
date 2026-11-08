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
exports.Switch = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_js_1 = require("./cx.js");
/** An on/off control with label and description. role="switch", 44 px target, Space and Enter toggle. */
exports.Switch = React.forwardRef(function Switch({ checked, onChange, label, description, className, id: idProp, disabled, onClick, ...rest }, ref) {
    const autoId = React.useId();
    const id = idProp !== null && idProp !== void 0 ? idProp : autoId;
    return ((0, jsx_runtime_1.jsxs)("button", { ref: ref, type: "button", role: "switch", id: id, "aria-checked": checked, "aria-describedby": description != null ? `${id}-desc` : undefined, disabled: disabled, className: (0, cx_js_1.cx)('cg-switch', className), onClick: (e) => {
            onClick === null || onClick === void 0 ? void 0 : onClick(e);
            if (!e.defaultPrevented)
                onChange(!checked);
        }, ...rest, children: [(0, jsx_runtime_1.jsxs)("span", { className: "cg-switch__text", children: [(0, jsx_runtime_1.jsx)("span", { className: "cg-switch__label", children: label }), description != null && ((0, jsx_runtime_1.jsx)("span", { className: "cg-switch__desc", id: `${id}-desc`, children: description }))] }), (0, jsx_runtime_1.jsx)("span", { className: "cg-switch__track", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("span", { className: "cg-switch__thumb" }) })] }));
});
