from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
INTRO_JS = (ROOT / 'js' / 'experience-intro.js').read_text(encoding='utf-8')
INTRO_CSS = (ROOT / 'css' / 'experience-intro.css').read_text(encoding='utf-8')


def test_final_transition_uses_explicit_blend_phase_before_resolve():
    assert 'intro-blending' in INTRO_JS, 'JS must enter an explicit light-blend phase before resolve'
    assert "classList.add('intro-blending')" in INTRO_JS
    assert "classList.remove('intro-pending', 'intro-running', 'intro-css-fallback', 'intro-blending')" in INTRO_JS


def test_root_dark_scrim_fades_instead_of_disappearing_at_resolve():
    running = re.search(r'html\.intro-pending::before,\s*html\.intro-running::before\s*\{([^}]*)\}', INTRO_CSS, re.S)
    assert running, 'missing root cinematic scrim'
    block = running.group(1)
    assert re.search(r'opacity:\s*1\s*;', block), 'root scrim needs an explicit opacity baseline'
    assert re.search(r'transition:\s*opacity\s+[78-9]\d\dms', block), 'root scrim fade should last roughly 0.8–1.0s'
    assert 'html.intro-running.intro-blending::before' in INTRO_CSS
    blend = re.search(r'html\.intro-running\.intro-blending::before\s*\{([^}]*)\}', INTRO_CSS, re.S)
    assert blend and re.search(r'opacity:\s*0\s*;', blend.group(1))


def test_intro_surface_passes_through_graphite_cool_gray_and_light():
    for tone in ['#171b22', '#737b87', '#d8dde5', '#f4f5f8']:
        assert tone in INTRO_JS, f'missing transition tone {tone}'
    # Hero reveal should overlap the light transition instead of waiting for a hard cut.
    assert "frame(4.16, { opacity: 1 })" in INTRO_JS
    fade_end = re.search(r"frame\((5\.[0-9]+), \{ opacity: 0, backgroundColor: '#f4f5f8' \}\)", INTRO_JS)
    assert fade_end, 'intro should remain present into the light phase before becoming transparent'


def test_rc4_invalidates_prior_intro_session_cache():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    assert 'ls-v11-signal-clarity-rc4-played' in html
    assert "boot.storageKey || 'ls-v11-signal-clarity-rc4-played'" in INTRO_JS
