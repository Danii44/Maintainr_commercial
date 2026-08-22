# Foodking UAE — Reference-Matched Design Brief

## Ground Truth

The provided Foodking React site is the authoritative visual and motion reference: https://foodking-react.vercel.app/

The UAE build will preserve the reference site’s overall composition, energetic fast-food character, red/green/cream palette, oversized hero typography, layered food photography, category strip, promotional banners, testimonial treatment, top utility bar, navigation hierarchy, hover states, carousel behavior, reveal-on-scroll motion, and mobile menu behavior. Localization will adapt content for the UAE, including AED pricing, UAE delivery language, Dubai/Abu Dhabi-oriented contact details, and right-to-left-friendly content handling where appropriate, without changing the core visual rhythm.

## Chosen Approach

### Design Movement
Reference-faithful contemporary fast-food editorial design: high-contrast commercial food photography combined with expressive display typography, offset composition, graphic stickers, and kinetic retail motion.

### Core Principles

1. **Motion is part of the identity.** Hero slides, floating decorative objects, marquee strips, hover lifts, and scroll reveals should feel continuous and intentional rather than ornamental.
2. **Food remains the focal point.** Text and UI frame the dish photography while preserving strong contrast and clear calls to action.
3. **Graphic energy without visual clutter.** Use layered shapes, angled accents, shadows, and texture, but keep navigational actions obvious.
4. **Reference fidelity before reinvention.** UAE localization changes wording, prices, and contact information; it does not dilute the original composition or animation language.

### Color Philosophy

The palette uses a near-black food-photography ground, warm cream surfaces, vivid tomato red, and fresh order-green. Black creates appetite and drama, cream gives the long page visual breathing room, red carries heat and urgency, and green signals action and freshness. The ownable signature color is **Foodking Order Green — #0A9E45**.

### Layout Paradigm

Use a long editorial scroll with full-bleed hero compositions, asymmetrical image/text overlaps, horizontal marquee bands, and alternating light/dark sections. The page should not feel like a stack of generic centered cards; its rhythm comes from changing section density, clipped decorative shapes, and deliberate image offsets.

### Signature Elements

- Oversized condensed uppercase display headlines with tight tracking.
- Floating chili, flame, tomato, and offer-badge motifs that drift or rotate subtly.
- Green pill/rectangular order buttons with a compact icon and tactile press response.

### Interaction Philosophy

Interactions should feel quick and physical. Buttons compress slightly on press, cards rise and sharpen their shadow on hover, navigation dropdowns appear from their trigger origin, carousel changes use a short directional slide/fade, and menu/cart surfaces open with a grounded drawer motion. Keyboard focus remains visible and reduced-motion users receive the same information without non-essential movement.

### Animation

The hero carousel should autoplay with a slow, polished cadence and provide accessible previous/next controls. Hero content enters in a staggered sequence: eyebrow, headline, supporting copy, CTA, then the food image and decorative motifs. Decorative objects use low-amplitude floating loops and occasional rotation. The product-category marquee moves continuously and pauses on hover/focus. Scroll reveals use opacity plus transform only, with 30–80ms staggered delays. Hover transitions stay around 180–240ms; drawers and modals use 260–420ms; all non-essential animation is gated by `prefers-reduced-motion`.

### Typography System

Use **Barlow Condensed** or a comparable condensed display face for hero and section headlines, with **DM Sans** for body copy, utility text, and controls. Headlines are bold, uppercase, tightly tracked, and visually oversized; body copy is short, readable, and calmer. Arabic-supporting fallback should be available for localized UAE copy.

### Brand Essence

A high-energy UAE quick-service food storefront for hungry customers who want bold flavor, fast ordering, and a playful brand experience. Personality: **energetic, generous, unapologetic**.

### Brand Voice

Headlines should be direct, appetite-led, and slightly theatrical. CTAs should sound immediate and useful, never generic. Microcopy should be concise and friendly.

Example lines:

> **Hot, crisp, and made for the moment.**

> **Your next feast is one tap away.**

### Wordmark & Logo

Use a compact food-symbol mark paired with the FOODKING wordmark, preserving the reference’s bold horizontal header presence. The mark should be usable independently as the favicon and mobile icon; it should not be reduced to a tiny decorative detail.

### UAE Localization Defaults

Until the user provides final business details, use clearly replaceable UAE placeholders for location, phone, hours, delivery zones, menu items, and AED pricing. No customer reviews or testimonials will be invented; any testimonial area will be presented as reference structure only or omitted until authentic copy is supplied.
