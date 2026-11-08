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
exports.DESKTOP_QUERY = exports.FOCUSABLE = void 0;
exports.useModalFocus = useModalFocus;
exports.useMediaQuery = useMediaQuery;
const React = __importStar(require("react"));
exports.FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
/**
 * Modal focus: moves focus inside when `active`, keeps Tab inside, closes on Escape, locks the body scroll,
 * and returns focus to the element that had it. Shared by Sheet, Dialog and SidePanel.
 */
function useModalFocus(active, panel, onClose) {
    const onCloseRef = React.useRef(onClose);
    onCloseRef.current = onClose;
    React.useEffect(() => {
        var _a;
        var _b;
        if (!active)
            return;
        const opener = (_b = document.activeElement) !== null && _b !== void 0 ? _b : null;
        const el = panel.current;
        const first = el === null || el === void 0 ? void 0 : el.querySelector(exports.FOCUSABLE);
        (_a = (first !== null && first !== void 0 ? first : el)) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
        const onKey = (e) => {
            var _a;
            if (e.key === 'Escape') {
                e.preventDefault();
                (_a = onCloseRef.current) === null || _a === void 0 ? void 0 : _a.call(onCloseRef);
                return;
            }
            if (e.key !== 'Tab' || !el)
                return;
            const items = Array.from(el.querySelectorAll(exports.FOCUSABLE)).filter((x) => x.offsetParent !== null || x === document.activeElement);
            if (!items.length) {
                e.preventDefault();
                el.focus();
                return;
            }
            const firstItem = items[0];
            const lastItem = items[items.length - 1];
            if (e.shiftKey && (document.activeElement === firstItem || document.activeElement === el)) {
                e.preventDefault();
                lastItem.focus();
            }
            else if (!e.shiftKey && document.activeElement === lastItem) {
                e.preventDefault();
                firstItem.focus();
            }
        };
        const onFocusIn = (e) => {
            var _a;
            if (el && !el.contains(e.target))
                ((_a = el.querySelector(exports.FOCUSABLE)) !== null && _a !== void 0 ? _a : el).focus();
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('focusin', onFocusIn);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('focusin', onFocusIn);
            document.body.style.overflow = prevOverflow;
            if (opener && typeof opener.focus === 'function' && document.contains(opener))
                opener.focus({ preventScroll: true });
        };
    }, [active, panel]);
}
/** The desktop breakpoint of Dialog and SidePanel. */
exports.DESKTOP_QUERY = '(min-width: 900px)';
/** True when the media query matches; `fallback` before mount and on the server. */
function useMediaQuery(query, fallback = false) {
    const get = () => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : fallback);
    const [matches, setMatches] = React.useState(get);
    React.useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function')
            return;
        const mq = window.matchMedia(query);
        const on = () => setMatches(mq.matches);
        on();
        mq.addEventListener('change', on);
        return () => mq.removeEventListener('change', on);
    }, [query]);
    return matches;
}
