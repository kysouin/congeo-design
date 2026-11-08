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
exports.useLang = useLang;
exports.LanguageSwitch = LanguageSwitch;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const cx_1 = require("./cx");
const Segmented_1 = require("./Segmented");
const core_js_1 = require("../i18n/core.js");
/** The interface language; the component re-renders when it changes, here or in another tool. */
function useLang() {
    const [, force] = React.useState(0);
    React.useEffect(() => (0, core_js_1.onLangChange)(() => force((x) => x + 1)), []);
    return (0, core_js_1.uiLang)();
}
/** «EN | ΕΛ». Each label is in its own language, so it reads correctly whichever one is set. */
function LanguageSwitch({ className, block, onChange }) {
    const lang = useLang();
    return ((0, jsx_runtime_1.jsx)(Segmented_1.Segmented, { label: (0, core_js_1.L)('Language', 'Γλώσσα'), className: (0, cx_1.cx)('cg-langswitch', className), block: block, value: lang, onChange: (l) => {
            (0, core_js_1.setLang)(l);
            onChange === null || onChange === void 0 ? void 0 : onChange(l);
        }, options: [
            { value: 'en', label: (0, jsx_runtime_1.jsx)("span", { lang: "en", "aria-label": "English", children: "EN" }) },
            { value: 'el', label: (0, jsx_runtime_1.jsx)("span", { lang: "el", "aria-label": "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", children: "\u0395\u039B" }) }, // cg-lint-ignore: each label names its own language
        ] }));
}
