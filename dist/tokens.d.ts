/* Generated from tokens/tokens.json by scripts/build.js. Do not edit. */

export type ColorName = "bg" | "surface" | "surface2" | "stage" | "onStage" | "line" | "lineSoft" | "lineStrong" | "ink" | "ink2" | "ink3" | "primary" | "onPrimary" | "link" | "linkHover" | "projectText" | "ok" | "warn" | "err" | "proposal" | "okTint" | "warnTint" | "errTint" | "proposalTint" | "eventTint" | "onEventTint" | "toolKaneto" | "toolKanetoTint" | "toolKanetoOnTint" | "toolRhoi" | "toolRhoiTint" | "toolRhoiOnTint" | "toolTrace" | "toolTraceTint" | "toolTraceOnTint" | "toolPermitflow" | "toolPermitflowTint" | "toolPermitflowOnTint" | "toolInternal" | "toolInternalTint" | "toolInternalOnTint" | "scrim" | "focus";
export type ToolId = "kaneto" | "rhoi" | "trace" | "permitflow" | "internal";
export type SizeKey = "s12" | "s13" | "s14" | "s15" | "s17" | "s20" | "s24" | "s30";
export type SpaceKey = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s8";
export type RadiusKey = "chip" | "row" | "card" | "cardLg" | "sheet" | "pill";
export type ShadowKey = "card" | "raised" | "primary" | "sheet";

export interface Shadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  elevation: number;
}
export interface Tool { label: string; color: string; tint: string; onTint: string; }
export interface Scheme {
  color: Record<ColorName, string>;
  shadow: Record<ShadowKey, Shadow>;
  tools: Record<ToolId, Tool>;
}
export interface Font {
  sans: string;
  mono: string;
  weight: { regular: 400; medium: 500; semibold: 600; bold: 700 };
  size: Record<SizeKey, number>;
  lineHeight: Record<SizeKey, number>;
  caps: { fontSize: number; fontWeight: string; letterSpacing: number; textTransform: "uppercase" };
  title: { fontSize: number; fontWeight: string; letterSpacing: number };
  monoFeatures: string[];
}
export interface Motion {
  duration: { fast: number; base: number; slow: number };
  easing: string;
  easingPoints: [number, number, number, number];
  spring: { damping: number; stiffness: number };
}
export interface Tokens {
  light: Scheme;
  dark: Scheme;
  font: Font;
  space: Record<SpaceKey, number>;
  radius: Record<RadiusKey, number>;
  touch: number;
  motion: Motion;
  icon: { stroke: number; sizes: number[] };
}
export declare const tokens: Tokens;
export declare const light: Scheme;
export declare const dark: Scheme;
export declare function scheme(name: "light" | "dark"): Scheme;
declare const _default: Tokens & { tokens: Tokens; light: Scheme; dark: Scheme; scheme: typeof scheme };
export default _default;
