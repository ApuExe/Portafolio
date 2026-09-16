from pathlib import Path
from urllib.parse import urlparse
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
README = (ROOT / 'README.md').read_text(encoding='utf-8')
SOUP = BeautifulSoup(HTML, 'html.parser')
LIVE_URL = 'https://apuexe.github.io/Portafolio/'
SOCIAL_IMAGE = LIVE_URL + 'assets/images/social-preview.jpg'


def _meta(*, prop=None, name=None):
    attrs = {'property': prop} if prop else {'name': name}
    return SOUP.find('meta', attrs=attrs)


def test_live_canonical_and_og_url_are_absolute_and_match_pages_url():
    canonical = SOUP.find('link', rel='canonical')
    og_url = _meta(prop='og:url')
    assert canonical and canonical.get('href') == LIVE_URL
    assert og_url and og_url.get('content') == LIVE_URL


def test_social_images_use_absolute_production_urls():
    og_image = _meta(prop='og:image')
    twitter_image = _meta(name='twitter:image')
    assert og_image and og_image.get('content') == SOCIAL_IMAGE
    assert twitter_image and twitter_image.get('content') == SOCIAL_IMAGE


def test_readme_declares_rc13_and_live_pages_url():
    assert 'La base activa es **V1.1 RC13 · Live Deployment QA**' in README
    assert LIVE_URL in README


def test_all_local_html_assets_exist_in_release_package():
    missing = []
    for tag, attr in [('img', 'src'), ('script', 'src'), ('link', 'href')]:
        for node in SOUP.find_all(tag):
            value = node.get(attr)
            if not value or value.startswith(('#', 'data:', 'mailto:', 'tel:', 'javascript:')):
                continue
            parsed = urlparse(value)
            if parsed.scheme or parsed.netloc:
                continue
            local_path = parsed.path.lstrip('/')
            if not local_path:
                continue
            if not (ROOT / local_path).exists():
                missing.append(local_path)
    assert not missing, f'Missing local assets referenced by HTML: {sorted(set(missing))}'
