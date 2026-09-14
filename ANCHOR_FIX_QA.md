# V2.13 Lite RC4 — Case Anchor Framing QA

## Issue
Clicking any work-experience link navigated to the outer `#case-*` section boundary. Because each case has editorial top padding, the first frame contained too much empty space before the actual case headline. The mismatch was especially visible in Amazon because `.exp-hero` aligns grid items to the end and its side column is taller.

## Root cause
The browser's native hash navigation targeted the section itself. `scroll-margin-top` correctly protected the fixed header, but it could not account for the section's internal padding or case-specific hero geometry.

## Fix
All links targeting `[data-experience]` keep their public `#case-*` hash but use a lightweight JS framing helper that scrolls the case's `.exp-hero-main` (kicker + headline) just below the fixed topbar. The helper respects `prefers-reduced-motion` and does not hijack wheel/touch scrolling.

## Regression test
`tests/test_case_anchor_framing.py` verifies all four Selected Work links at 1584×692:
- URL hash remains `#case-*`.
- `.exp-hero-main` lands 8–42 px below the fixed topbar.
- Headline appears within 90 px below the topbar.

## Regression suite
- `node --check js/app.js`
- `python tests/validate_v213.py`
- `python tests/test_cv_explorer.py`
- `python tests/test_system_layout.py`
- `pytest -q tests/test_case_anchor_framing.py`
- CSS parsed with `tinycss2`: 0 errors.
