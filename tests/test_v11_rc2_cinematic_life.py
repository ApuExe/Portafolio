from pathlib import Path
from bs4 import BeautifulSoup
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
INTRO_CSS = (ROOT / 'css' / 'experience-intro.css').read_text(encoding='utf-8')
MOTION_CSS = (ROOT / 'css' / 'motion-system.css').read_text(encoding='utf-8')
INTRO_JS = (ROOT / 'js' / 'experience-intro.js').read_text(encoding='utf-8')
MOTION_JS = (ROOT / 'js' / 'motion-system.js').read_text(encoding='utf-8')
APP_JS = (ROOT / 'js' / 'app.js').read_text(encoding='utf-8')
SOUP = BeautifulSoup(HTML, 'html.parser')


def test_prepaint_boot_runs_in_head_before_stylesheets():
    head = SOUP.head
    boot = head.select_one('script[data-intro-prepaint]')
    assert boot is not None, 'missing synchronous intro prepaint boot script'
    nodes = [node for node in head.children if getattr(node, 'name', None)]
    boot_index = nodes.index(boot)
    first_css_index = next(i for i, node in enumerate(nodes) if node.name == 'link' and node.get('rel') == ['stylesheet'])
    assert boot_index < first_css_index, 'prepaint script must execute before render-blocking CSS'
    source = boot.get_text()
    assert 'intro-pending' in source
    assert 'prefers-reduced-motion: reduce' in source
    assert 'sessionStorage' in source


def test_replay_query_can_force_intro_even_after_session_playback():
    assert "intro=replay" in INTRO_JS or "searchParams.get('intro') === 'replay'" in INTRO_JS
    assert 'forceReplay' in INTRO_JS


def test_rc2_uses_longer_contrast_rhythm():
    # Keep the explicit target in code so future edits cannot silently compress the opening again.
    match = re.search(r'desktopSeconds:\s*([0-9.]+)', INTRO_JS)
    assert match, 'missing documented desktop intro duration target'
    assert float(match.group(1)) >= 4.7
    compact = re.search(r'compactSeconds:\s*([0-9.]+)', INTRO_JS)
    assert compact, 'missing documented compact intro duration target'
    assert 3.5 <= float(compact.group(1)) <= 4.2
    assert 'VISUAL_SILENCE' in INTRO_JS
    assert 'SATURATION_HOLD' in INTRO_JS


def test_pending_state_masks_first_paint_and_has_safe_escape_hatch():
    assert 'html.intro-pending' in INTRO_CSS
    assert 'html.intro-pending body' in INTRO_CSS
    assert 'intro-prepaint-timeout' in HTML
    assert 'intro-running' in HTML


def test_global_life_layer_reaches_all_major_portfolio_zones():
    for selector in [
        '.project-row',
        '[data-experience]',
        '.system-section',
        '.profile-signature',
        '.contact-section',
    ]:
        assert selector in MOTION_JS, f'missing life-zone support for {selector}'
    assert '--life-x' in MOTION_JS
    assert '--life-y' in MOTION_JS
    assert 'data-life-zone' in MOTION_JS


def test_global_life_has_tactile_media_system_and_contact_motion():
    assert '.life-zone' in MOTION_CSS
    assert '.exp-product-shot:hover img' in MOTION_CSS
    assert '.system-engine-orbit' in MOTION_CSS
    assert '@keyframes systemOrbitBreathe' in MOTION_CSS
    assert '.contact-message-link:hover i' in MOTION_CSS
    assert '@media (prefers-reduced-motion: reduce)' in MOTION_CSS


def test_prepaint_timeout_aborts_late_intro_instead_of_restarting_after_flash():
    assert 'aborted: false' in HTML
    assert '__portfolioIntroBoot.aborted = true' in HTML
    assert "if (boot.aborted)" in INTRO_JS
    assert "resolve('prepaint-timeout')" in INTRO_JS


def test_existing_ambient_assets_have_more_visible_but_still_slow_breathing():
    assert 'xPercent: direction * 1.8' in APP_JS
    assert 'yPercent: direction * -2.2' in APP_JS
    assert 'duration: 8 + (index % 4) * 1.1' in APP_JS
