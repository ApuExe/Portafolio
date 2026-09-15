from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
CSS = (ROOT / 'css' / 'experience-intro.css').read_text(encoding='utf-8')
JS = (ROOT / 'js' / 'experience-intro.js').read_text(encoding='utf-8')
SOUP = BeautifulSoup(HTML, 'html.parser')


def test_signal_clarity_intro_has_cinematic_layers():
    intro = SOUP.select_one('[data-experience-intro]')
    assert intro is not None
    assert intro.get('data-intro-version') == 'signal-clarity-v11'
    assert len(intro.select('[data-intro-signal].experience-intro__signal--xl')) >= 3
    assert intro.select_one('[data-intro-noise]') is not None
    assert intro.select_one('[data-intro-cut]') is not None


def test_hero_title_is_mask_reveal_ready():
    lines = SOUP.select('[data-hero-title] .hero-line > span')
    assert len(lines) == 3
    assert all(line.has_attr('data-hero-reveal') for line in lines)


def test_intro_css_has_dark_signal_phase_and_full_width_cut():
    assert 'html.intro-running::before' in CSS
    assert '.experience-intro__signal--xl' in CSS
    assert '.experience-intro__cut' in CSS
    assert 'width: 100vw' in CSS
    assert 'mix-blend-mode' in CSS


def test_intro_js_has_contrast_rhythm_and_persistent_pointer_life():
    # The hero should not die after the opening sequence: pointer motion remains
    # available through a separate resolved-state handler.
    assert 'initResolvedHeroMotion' in JS
    assert "--hero-live-x" in JS
    assert "--hero-live-y" in JS
    # Contrast rhythm: saturation -> cut -> title reveal, rather than one uniform fade.
    assert "data-intro-cut" in JS
    assert "data-intro-noise" in JS
    assert "data-hero-reveal" in JS



def test_intro_temporarily_quiets_page_chrome():
    assert 'html.intro-running .topbar' in CSS
    assert 'html.intro-running .explore-console' in CSS
    assert 'pointer-events: none' in CSS


def test_reduced_motion_still_skips_cinematic_intro():
    assert "if (reduceMotion)" in JS
    assert "resolve('reduced-motion')" in JS
    assert '@media (prefers-reduced-motion: reduce)' in CSS
