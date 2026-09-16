from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
README = (ROOT / 'README.md').read_text(encoding='utf-8')
SOUP = BeautifulSoup(HTML, 'html.parser')


def _meta(*, prop=None, name=None):
    attrs = {'property': prop} if prop else {'name': name}
    return SOUP.find('meta', attrs=attrs)


def test_readme_preserves_rc12_release_documentation():
    assert '## V1.1 RC12 — Production Readiness' in README


def test_social_preview_metadata_is_complete():
    og_image = _meta(prop='og:image')
    og_alt = _meta(prop='og:image:alt')
    twitter_card = _meta(name='twitter:card')
    twitter_image = _meta(name='twitter:image')
    twitter_alt = _meta(name='twitter:image:alt')

    assert og_image and og_image.get('content', '').endswith('assets/images/social-preview.jpg')
    assert og_alt and 'Luis Sabrera' in og_alt.get('content', '')
    assert twitter_card and twitter_card.get('content') == 'summary_large_image'
    assert twitter_image and twitter_image.get('content', '').endswith('assets/images/social-preview.jpg')
    assert twitter_alt and 'Luis Sabrera' in twitter_alt.get('content', '')
    assert (ROOT / 'assets/images/social-preview.jpg').is_file()


def test_below_fold_crmaster_hero_image_is_not_eager():
    image = SOUP.find('img', attrs={'src': 'assets/images/crmaster-prospectos-light-real.webp'})
    assert image is not None
    assert image.get('loading') == 'lazy'
    assert image.get('decoding') == 'async'
    assert image.get('fetchpriority') != 'high'


def test_lazy_content_images_use_async_decoding():
    lazy_images = [img for img in SOUP.find_all('img') if img.get('loading') == 'lazy']
    assert lazy_images, 'Expected lazy-loaded content images.'
    offenders = [img.get('src') for img in lazy_images if img.get('decoding') != 'async']
    assert not offenders, f'Lazy images missing decoding="async": {offenders}'


def test_google_fonts_preconnect_contract_is_preserved():
    links = SOUP.find_all('link', rel='preconnect')
    hrefs = {link.get('href'): link for link in links}
    assert 'https://fonts.googleapis.com' in hrefs
    assert 'https://fonts.gstatic.com' in hrefs
    assert hrefs['https://fonts.gstatic.com'].has_attr('crossorigin')
