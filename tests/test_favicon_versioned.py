from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
IMAGES = ROOT / 'assets' / 'images'


def test_html_uses_versioned_canonical_favicons():
    assert 'favicon-ls-v213-32.png' in HTML
    assert 'favicon-ls-v213-64.png' in HTML
    assert 'apple-touch-icon-ls-v213.png' in HTML
    assert 'href="assets/images/favicon-64.png"' not in HTML


def test_favicons_are_exact_derivatives_of_canonical_icon():
    canonical = Image.open(IMAGES / 'ls-top-icon.png').convert('RGBA')
    for filename, size in [
        ('favicon-ls-v213-32.png', 32),
        ('favicon-ls-v213-64.png', 64),
        ('apple-touch-icon-ls-v213.png', 180),
    ]:
        actual = Image.open(IMAGES / filename).convert('RGBA')
        expected = canonical.resize((size, size), Image.Resampling.LANCZOS)
        assert actual.size == (size, size)
        assert ImageChops.difference(actual, expected).getbbox() is None
