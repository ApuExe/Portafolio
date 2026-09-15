from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT/'index.html').read_text(encoding='utf-8')


def test_case_choreography_module_is_loaded_after_existing_motion_layer():
    assert 'js/case-choreography.js' in HTML
    assert HTML.index('js/motion-system.js') < HTML.index('js/case-choreography.js')


def test_choreography_uses_native_observers_and_waapi_without_scroll_hijacking():
    js = (ROOT/'js'/'case-choreography.js').read_text(encoding='utf-8')
    assert 'IntersectionObserver' in js
    assert '.animate(' in js
    assert 'prefers-reduced-motion' in js
    forbidden = ['ScrollTrigger', 'scrub:', 'pin:', "addEventListener('wheel'", 'preventDefault() // scroll']
    assert not any(token in js for token in forbidden), js


def test_each_case_has_a_distinct_motion_dialect():
    css = (ROOT/'css'/'case-choreography.css').read_text(encoding='utf-8')
    for selector in ['#case-tkoh', '#case-amp', '#case-20prod', '#case-visual']:
        assert selector in css
    assert 'case-bridge' in css
    assert 'choreo-active' in css
    assert '@media (max-width: 760px)' in css
    assert '@media (prefers-reduced-motion: reduce)' in css


def test_case_transitions_have_semantic_progression_labels():
    js = (ROOT/'js'/'case-choreography.js').read_text(encoding='utf-8')
    for label in ['PRODUCTO', 'MARKETING / DATOS', 'COMUNICACIÓN VISUAL', 'CONTEXTO / PERSONAS']:
        assert label in js
    assert 'case-bridge' in js
