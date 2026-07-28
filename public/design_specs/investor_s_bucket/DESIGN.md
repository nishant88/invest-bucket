---
name: Investor's Bucket
colors:
  surface: '#f9f9f8'
  surface-dim: '#dadad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#eeeeed'
  surface-container-high: '#e8e8e7'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3f4944'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1f0'
  outline: '#6f7973'
  outline-variant: '#bec9c2'
  surface-tint: '#1b6b51'
  primary: '#004532'
  on-primary: '#ffffff'
  primary-container: '#065f46'
  on-primary-container: '#8bd6b7'
  inverse-primary: '#8bd6b6'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#3f3b39'
  on-tertiary: '#ffffff'
  tertiary-container: '#575250'
  on-tertiary-container: '#cdc6c2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f2d1'
  primary-fixed-dim: '#8bd6b6'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e9e1dd'
  tertiary-fixed-dim: '#ccc5c2'
  on-tertiary-fixed: '#1e1b19'
  on-tertiary-fixed-variant: '#4a4643'
  background: '#f9f9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  currency-display:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 20px
  stack-gap: 16px
  card-inner-padding: 20px
  tap-target-min: 48px
---

## Brand & Style

The design system for this mobile-first fintech application is built on the pillars of **Trust, Warmth, and Accessibility**. It caters to Indian pre-founders—a demographic that values both professional reliability and a modern, approachable interface. 

The design style follows a **Modern Corporate** aesthetic with a **Tactile** edge. It utilizes a card-based architecture to organize complex financial data into digestible, "bucketed" units. The interface avoids the cold, sterile feel of traditional banking by using a warm off-white canvas and lush, organic primary tones. Every interaction is designed to feel grounded and intentional, reflecting the gravity of capital management while maintaining the agility of a startup tool.

## Colors

The palette is rooted in the "Emerald and Saffron" heritage but modernized for a digital fintech context. 

- **Primary (Deep Emerald):** Used for headers, primary actions, and brand moments. It symbolizes growth and stability.
- **Accent (Warm Amber):** Reserved for high-priority CTAs and alerts. It provides a warm contrast to the deep teal, ensuring secondary actions are still visible.
- **Background (Stone Off-White):** A soft, non-reflective background that reduces eye strain and feels more premium than pure white.
- **Text (Dark Charcoal):** High-contrast typography ensures legibility for financial figures and legal text.

**Currency Formatting:** All monetary values must use the `₹` symbol followed by a non-breaking space, utilizing the Indian numbering system (e.g., ₹ 1,00,000 for one Lakh).

## Typography

The system utilizes **Plus Jakarta Sans** for headlines to provide a soft, rounded, and welcoming personality. **Inter** is used for body text and data points due to its exceptional legibility and robust support for Devanagari script rendering, essential for the Indian market.

Generous line heights are maintained throughout to ensure that financial terms and numbers do not feel cramped. Headlines use a tighter letter-spacing to maintain a strong visual "lockup" for brand-led screens. All body text should default to a 1.5x line-height ratio to maximize readability during long sessions.

## Layout & Spacing

This is a **mobile-first** design system optimized for portrait orientation. The layout relies on a **Fluid Grid** with a 4-column structure for mobile devices.

- **Margins:** A consistent 20px horizontal margin is applied to the main screen container.
- **Stacking:** Elements follow a vertical rhythm based on an 8px scale.
- **Touch Targets:** All interactive elements (buttons, links, chevron icons) must adhere to a minimum 48x48px tap area to ensure accessibility for users on the go.
- **Whitespace:** Use generous vertical padding between cards (16px to 24px) to prevent the "wall of data" effect common in fintech.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh borders in favor of soft, diffused shadows that lift cards off the off-white background.

- **Level 0 (Surface):** The background (#fafaf9).
- **Level 1 (Cards):** White surfaces with a 10% opacity shadow, 12px blur, and 4px vertical offset.
- **Level 2 (Modals/Action Sheets):** White surfaces with a 15% opacity shadow, 20px blur, and 8px vertical offset.

Shadows should be slightly tinted with the primary Emerald color (e.g., #065f46 at 5% opacity) to maintain a cohesive, warm atmosphere rather than a sterile grey.

## Shapes

The shape language is defined by significant **roundedness (16px - 20px)**. This reflects the "Bucket" metaphor—suggesting a container that is friendly, safe, and holds value.

- **Primary Containers:** 20px corner radius (Rounded-XL).
- **Buttons and Inputs:** 16px corner radius (Rounded-LG).
- **Small Components (Chips/Badges):** Fully pill-shaped to contrast against the larger structural cards.

## Components

- **Buttons:** Primary buttons use the Deep Emerald background with white text. Secondary buttons use a light tint of Emerald with Deep Emerald text. CTAs use the Warm Amber. All buttons have a minimum height of 52px.
- **Cards:** The primary container for information. Cards feature 20px rounded corners and a soft ambient shadow. They should include a subtle 1px stroke (#e7e5e4) for definition on higher-brightness screens.
- **Input Fields:** Fields use a subtle grey background with a bottom-border focus state in Deep Emerald. Labels are always visible above the field in `label-md` style.
- **Status Chips:** Small, pill-shaped indicators. They use high-contrast text against a 10-15% opacity background of the respective status color (e.g., Approved uses Emerald text on a light mint background).
- **Bucket Progress Bar:** A custom component showing funding or savings progress. It uses a thick 12px track with rounded ends; the "fill" is Emerald, and the "unfilled" track is a soft grey-beige.
- **List Items:** Feature a 16px vertical padding with a subtle divider line that doesn't span the full width, leaving space for icons or avatars on the left.