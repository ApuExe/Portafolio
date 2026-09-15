from pathlib import Path
from bs4 import BeautifulSoup
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
INTRO_JS = (ROOT / 'js' / 'experience-intro.js').read_text(encoding='utf-8')
INTRO_CSS = (ROOT / 'css' / 'experience-intro.css').read_text(encoding='utf-8')
APP_JS = (ROOT / 'js' / 'app.js').read_text(encoding='utf-8')
SOUP = BeautifulSoup(HTML, 'html.parser')


def test_critical_intro_has_no_remote_animation_runtime_dependency():
    sources = [tag.get('src', '') for tag in SOUP.find_all('script', src=True)]
    assert not any('cdn.jsdelivr.net/npm/gsap' in src for src in sources)
    assert not any('cdnjs.cloudflare.com/ajax/libs/gsap' in src for src in sources)
    assert 'window.gsap' not in INTRO_JS
    assert '.animate(' in INTRO_JS, 'intro should use the native Web Animations API'


def test_native_intro_keeps_cinematic_timing_contract():
    desktop = re.search(r'desktopSeconds:\s*([0-9.]+)', INTRO_JS)
    compact = re.search(r'compactSeconds:\s*([0-9.]+)', INTRO_JS)
    assert desktop and float(desktop.group(1)) >= 4.7
    assert compact and 3.5 <= float(compact.group(1)) <= 4.2
    assert 'VISUAL_SILENCE' in INTRO_JS
    assert 'SATURATION_HOLD' in INTRO_JS
    assert 'runNativeTimeline' in INTRO_JS


def test_prepaint_escape_hatch_cannot_cancel_a_normal_local_boot():
    boot = SOUP.select_one('script[data-intro-prepaint]')
    assert boot is not None
    source = boot.get_text()
    timeout = re.search(r'},\s*(\d{4,})\s*\);', source)
    assert timeout, 'missing prepaint escape timeout'
    assert int(timeout.group(1)) >= 7000


def test_pending_state_has_visible_motion_before_deferred_js_boots():
    assert 'html.intro-pending .experience-intro__signals' in INTRO_CSS
    assert '@keyframes introBootSignal' in INTRO_CSS
    assert '@keyframes introBootGrid' in INTRO_CSS


def test_app_remains_functional_without_gsap():
    # The historical enhancement layer is optional; no GSAP must not abort app.js.
    assert "if (!gsap || !ScrollTrigger) return;" in APP_JS

MOTION_JS = (ROOT / 'js' / 'motion-system.js').read_text(encoding='utf-8')
MOTION_CSS = (ROOT / 'css' / 'motion-system.css').read_text(encoding='utf-8')


def test_native_reveal_layer_preserves_page_life_without_gsap():
    assert 'native-reveal' in MOTION_JS
    assert 'nativeRevealObserver' in MOTION_JS
    assert '.native-reveal' in MOTION_CSS
    assert '.native-reveal.is-native-visible' in MOTION_CSS


def test_intro_layer_sits_above_root_dark_scrim_and_hides_chrome():
    hero_block = re.search(r'html\.has-experience-intro \.hero\s*\{([^}]*)\}', INTRO_CSS, re.S)
    assert hero_block, 'missing intro hero stacking block'
    assert re.search(r'z-index:\s*[2-9]\d*\s*;', hero_block.group(1)), 'hero stacking context must sit above root cinematic scrim'
    assert 'html.intro-running .topbar' in INTRO_CSS
    assert 'html.intro-running .explore-console' in INTRO_CSS
