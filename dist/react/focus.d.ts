import * as React from 'react';
export declare const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
/**
 * Modal focus: moves focus inside when `active`, keeps Tab inside, closes on Escape, locks the body scroll,
 * and returns focus to the element that had it. Shared by Sheet, Dialog and SidePanel.
 */
export declare function useModalFocus(active: boolean, panel: React.RefObject<HTMLElement | null>, onClose?: () => void): void;
/** The desktop breakpoint of Dialog and SidePanel. */
export declare const DESKTOP_QUERY = "(min-width: 900px)";
/** True when the media query matches; `fallback` before mount and on the server. */
export declare function useMediaQuery(query: string, fallback?: boolean): boolean;
