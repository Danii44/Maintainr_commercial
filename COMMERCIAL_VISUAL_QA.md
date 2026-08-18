# Commercial Visual QA

Updated: 18 August 2026

The local light-first commercial home page was reviewed in Arabic RTL mode. The header, hero, evaluation rail, role workflow content, and distinct Customer portal, Request demo, and Request quote conversion paths render as separate, readable actions. The hero retains a product-operation visual while the surrounding editorial surface, headings, supporting text, cards, navigation, and fixed conversion rail use the new professional light treatment.

The first visual pass found insufficient contrast in the Arabic hero heading and supporting copy against the pale background. The light-theme overrides were corrected to apply a high-contrast slate treatment to headings and stronger muted text, and the follow-up visual check confirmed the hierarchy is readable. The optional dark theme remains available through the shared theme provider.

The subsequent light-only correction removes every remaining enumerated hardcoded dark background token, black surface treatment, dark image overlay gradient, and dark gradient stop when the root is not in dark mode. It preserves these treatments only for the optional dark theme. The local English public route remains reachable after the change, and the commercial test suite and Netlify build both pass. The browser subsequently lost its active tab before another screenshot could be captured; a final visual screenshot must be repeated after reopening an active browser tab.

Headless desktop verification was then completed at 1440 pixels after the landing motion settled. The commercial home now presents white and soft-gray surfaces, a pale lavender/aqua hero field, high-contrast slate text, and a lightened product visual with white overlay cards. The former near-black quotation controls in the header and conversion rail were replaced with violet actions so no dark interface control remains in the default light experience. The optional dark theme is the only path that retains dark panels.

The same local light experience was captured at a 390-pixel mobile viewport. The compact header, hero copy, two primary journey buttons, and fixed three-path conversion rail remain readable with white, teal, and violet treatments. No dark image, panel, or primary control appears at the mobile default theme.
