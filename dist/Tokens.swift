// Generated from tokens/tokens.json by scripts/build.js. Do not edit.
// CONGEO design tokens for the native Swift parts. Colours resolve to the dark variant automatically.

import Foundation
#if canImport(UIKit)
import UIKit
#endif
#if canImport(SwiftUI)
import SwiftUI
#endif

public struct CGTokenColor: Equatable {
  public let r: Int; public let g: Int; public let b: Int; public let a: Double
  public var hex: String { String(format: "#%02X%02X%02X", r, g, b) }
}

public struct CGDynamicColor {
  public let light: CGTokenColor
  public let dark: CGTokenColor
  #if canImport(UIKit)
  public var uiColor: UIColor {
    UIColor { traits in
      let c = traits.userInterfaceStyle == .dark ? self.dark : self.light
      return UIColor(red: CGFloat(c.r) / 255, green: CGFloat(c.g) / 255, blue: CGFloat(c.b) / 255, alpha: CGFloat(c.a))
    }
  }
  #endif
  #if canImport(SwiftUI) && canImport(UIKit)
  public var color: Color { Color(uiColor) }
  #endif
}

public enum CongeoTokens {
  public enum Colors {
    public static let bg = CGDynamicColor(light: CGTokenColor(r: 243, g: 245, b: 247, a: 1), dark: CGTokenColor(r: 10, g: 22, b: 34, a: 1))
    public static let surface = CGDynamicColor(light: CGTokenColor(r: 255, g: 255, b: 255, a: 1), dark: CGTokenColor(r: 19, g: 33, b: 45, a: 1))
    public static let surface2 = CGDynamicColor(light: CGTokenColor(r: 238, g: 241, b: 244, a: 1), dark: CGTokenColor(r: 28, g: 42, b: 54, a: 1))
    public static let line = CGDynamicColor(light: CGTokenColor(r: 221, g: 225, b: 230, a: 1), dark: CGTokenColor(r: 34, g: 49, b: 62, a: 1))
    public static let lineSoft = CGDynamicColor(light: CGTokenColor(r: 228, g: 232, b: 236, a: 1), dark: CGTokenColor(r: 26, g: 40, b: 51, a: 1))
    public static let lineStrong = CGDynamicColor(light: CGTokenColor(r: 203, g: 210, b: 217, a: 1), dark: CGTokenColor(r: 42, g: 57, b: 70, a: 1))
    public static let ink = CGDynamicColor(light: CGTokenColor(r: 10, g: 22, b: 34, a: 1), dark: CGTokenColor(r: 242, g: 245, b: 247, a: 1))
    public static let ink2 = CGDynamicColor(light: CGTokenColor(r: 91, g: 103, b: 114, a: 1), dark: CGTokenColor(r: 181, g: 192, b: 201, a: 1))
    public static let ink3 = CGDynamicColor(light: CGTokenColor(r: 100, g: 110, b: 120, a: 1), dark: CGTokenColor(r: 138, g: 150, b: 161, a: 1))
    public static let primary = CGDynamicColor(light: CGTokenColor(r: 0, g: 174, b: 239, a: 1), dark: CGTokenColor(r: 0, g: 174, b: 239, a: 1))
    public static let onPrimary = CGDynamicColor(light: CGTokenColor(r: 10, g: 22, b: 34, a: 1), dark: CGTokenColor(r: 10, g: 22, b: 34, a: 1))
    public static let link = CGDynamicColor(light: CGTokenColor(r: 0, g: 113, b: 164, a: 1), dark: CGTokenColor(r: 92, g: 203, b: 245, a: 1))
    public static let linkHover = CGDynamicColor(light: CGTokenColor(r: 0, g: 90, b: 131, a: 1), dark: CGTokenColor(r: 142, g: 219, b: 248, a: 1))
    public static let projectText = CGDynamicColor(light: CGTokenColor(r: 0, g: 113, b: 164, a: 1), dark: CGTokenColor(r: 127, g: 216, b: 250, a: 1))
    public static let ok = CGDynamicColor(light: CGTokenColor(r: 30, g: 123, b: 79, a: 1), dark: CGTokenColor(r: 143, g: 224, b: 181, a: 1))
    public static let warn = CGDynamicColor(light: CGTokenColor(r: 154, g: 90, b: 10, a: 1), dark: CGTokenColor(r: 240, g: 185, b: 87, a: 1))
    public static let err = CGDynamicColor(light: CGTokenColor(r: 180, g: 35, b: 24, a: 1), dark: CGTokenColor(r: 255, g: 143, b: 134, a: 1))
    public static let proposal = CGDynamicColor(light: CGTokenColor(r: 122, g: 63, b: 176, a: 1), dark: CGTokenColor(r: 211, g: 181, b: 240, a: 1))
    public static let okTint = CGDynamicColor(light: CGTokenColor(r: 227, g: 244, b: 234, a: 1), dark: CGTokenColor(r: 17, g: 53, b: 42, a: 1))
    public static let warnTint = CGDynamicColor(light: CGTokenColor(r: 251, g: 238, b: 219, a: 1), dark: CGTokenColor(r: 61, g: 46, b: 18, a: 1))
    public static let errTint = CGDynamicColor(light: CGTokenColor(r: 252, g: 232, b: 230, a: 1), dark: CGTokenColor(r: 67, g: 32, b: 29, a: 1))
    public static let proposalTint = CGDynamicColor(light: CGTokenColor(r: 243, g: 236, b: 250, a: 1), dark: CGTokenColor(r: 42, g: 31, b: 61, a: 1))
    public static let eventTint = CGDynamicColor(light: CGTokenColor(r: 221, g: 243, b: 252, a: 1), dark: CGTokenColor(r: 18, g: 58, b: 77, a: 1))
    public static let onEventTint = CGDynamicColor(light: CGTokenColor(r: 31, g: 74, b: 92, a: 1), dark: CGTokenColor(r: 191, g: 230, b: 247, a: 1))
    public static let toolKaneto = CGDynamicColor(light: CGTokenColor(r: 0, g: 174, b: 239, a: 1), dark: CGTokenColor(r: 0, g: 174, b: 239, a: 1))
    public static let toolKanetoTint = CGDynamicColor(light: CGTokenColor(r: 221, g: 243, b: 252, a: 1), dark: CGTokenColor(r: 14, g: 58, b: 79, a: 1))
    public static let toolKanetoOnTint = CGDynamicColor(light: CGTokenColor(r: 31, g: 74, b: 92, a: 1), dark: CGTokenColor(r: 154, g: 221, b: 247, a: 1))
    public static let toolRhoi = CGDynamicColor(light: CGTokenColor(r: 29, g: 91, b: 184, a: 1), dark: CGTokenColor(r: 94, g: 147, b: 230, a: 1))
    public static let toolRhoiTint = CGDynamicColor(light: CGTokenColor(r: 230, g: 238, b: 249, a: 1), dark: CGTokenColor(r: 22, g: 48, b: 79, a: 1))
    public static let toolRhoiOnTint = CGDynamicColor(light: CGTokenColor(r: 38, g: 64, b: 107, a: 1), dark: CGTokenColor(r: 169, g: 198, b: 242, a: 1))
    public static let toolTrace = CGDynamicColor(light: CGTokenColor(r: 181, g: 84, b: 29, a: 1), dark: CGTokenColor(r: 224, g: 122, b: 69, a: 1))
    public static let toolTraceTint = CGDynamicColor(light: CGTokenColor(r: 251, g: 234, b: 224, a: 1), dark: CGTokenColor(r: 70, g: 40, b: 26, a: 1))
    public static let toolTraceOnTint = CGDynamicColor(light: CGTokenColor(r: 110, g: 50, b: 16, a: 1), dark: CGTokenColor(r: 240, g: 182, b: 145, a: 1))
    public static let toolPermitflow = CGDynamicColor(light: CGTokenColor(r: 15, g: 118, b: 110, a: 1), dark: CGTokenColor(r: 45, g: 181, b: 168, a: 1))
    public static let toolPermitflowTint = CGDynamicColor(light: CGTokenColor(r: 221, g: 243, b: 240, a: 1), dark: CGTokenColor(r: 15, g: 58, b: 55, a: 1))
    public static let toolPermitflowOnTint = CGDynamicColor(light: CGTokenColor(r: 11, g: 79, b: 74, a: 1), dark: CGTokenColor(r: 143, g: 218, b: 210, a: 1))
    public static let toolInternal = CGDynamicColor(light: CGTokenColor(r: 91, g: 103, b: 114, a: 1), dark: CGTokenColor(r: 138, g: 150, b: 161, a: 1))
    public static let toolInternalTint = CGDynamicColor(light: CGTokenColor(r: 238, g: 241, b: 244, a: 1), dark: CGTokenColor(r: 28, g: 42, b: 54, a: 1))
    public static let toolInternalOnTint = CGDynamicColor(light: CGTokenColor(r: 58, g: 71, b: 82, a: 1), dark: CGTokenColor(r: 181, g: 192, b: 201, a: 1))
    public static let scrim = CGDynamicColor(light: CGTokenColor(r: 10, g: 22, b: 34, a: 0.45), dark: CGTokenColor(r: 0, g: 0, b: 0, a: 0.6))
    public static let focus = CGDynamicColor(light: CGTokenColor(r: 0, g: 174, b: 239, a: 1), dark: CGTokenColor(r: 92, g: 203, b: 245, a: 1))
  }
  public enum FontSize {
    public static let s12: CGFloat = 12
    public static let s13: CGFloat = 13
    public static let s14: CGFloat = 14
    public static let s15: CGFloat = 15
    public static let s17: CGFloat = 17
    public static let s20: CGFloat = 20
    public static let s24: CGFloat = 24
    public static let s30: CGFloat = 30
  }
  public enum LineHeight {
    public static let s12: CGFloat = 16
    public static let s13: CGFloat = 18
    public static let s14: CGFloat = 20
    public static let s15: CGFloat = 22
    public static let s17: CGFloat = 24
    public static let s20: CGFloat = 26
    public static let s24: CGFloat = 30
    public static let s30: CGFloat = 36
  }
  public enum Fonts {
    public static let sans = "Inter"
    public static let mono = "JetBrains Mono"
    public static let capsTracking: CGFloat = 0.08 // em
    public static let titleTracking: CGFloat = -0.02 // em
  }
  public enum Radius {
    public static let chip: CGFloat = 6
    public static let row: CGFloat = 10
    public static let card: CGFloat = 14
    public static let cardLg: CGFloat = 16
    public static let sheet: CGFloat = 22
    public static let pill: CGFloat = 999
  }
  public enum Space {
    public static let s1: CGFloat = 4
    public static let s2: CGFloat = 8
    public static let s3: CGFloat = 12
    public static let s4: CGFloat = 16
    public static let s5: CGFloat = 20
    public static let s6: CGFloat = 24
    public static let s8: CGFloat = 32
  }
  public static let touch: CGFloat = 44
  public enum Motion {
    public static let fast: TimeInterval = 0.12
    public static let base: TimeInterval = 0.2
    public static let slow: TimeInterval = 0.32
    public static let springDamping: Double = 18
    public static let springStiffness: Double = 220
  }
}
