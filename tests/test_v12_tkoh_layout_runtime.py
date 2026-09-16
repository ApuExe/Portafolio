from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CSS_FILES = [
    'style.css', 'stability.css', 'interactive.css', 'design-system.css',
    'motion-system.css', 'case-choreography.css', 'experience-intro.css',
    'profile-closing.css',
]


def build_document():
    soup = BeautifulSoup((ROOT / 'index.html').read_text(encoding='utf-8'), 'html.parser')
    for script in list(soup.find_all('script')):
        script.decompose()
    for link in list(soup.find_all('link', rel='stylesheet')):
        link.decompose()
    style = soup.new_tag('style')
    style.string = '\n'.join((ROOT / 'css' / name).read_text(encoding='utf-8') for name in CSS_FILES)
    soup.head.append(style)
    soup.html['class'] = ['intro-resolved']
    return str(soup)


def inspect(width):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': width, 'height': 900})
        page.set_content(build_document(), wait_until='domcontentloaded')
        result = page.evaluate('''() => {
          const section = document.querySelector('#case-tkoh .exp-sequence').getBoundingClientRect();
          return {
            sequenceHeight: section.height,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth,
          };
        }''')
        browser.close()
        return result


def test_tkoh_system_scale_is_at_least_30_percent_shorter_than_rc13_desktop():
    result = inspect(1440)
    assert result['sequenceHeight'] <= 510, result


def test_tkoh_v12_has_no_horizontal_overflow_at_required_widths():
    for width in (320, 360, 390, 430, 768, 1024, 1440):
        result = inspect(width)
        assert result['scrollWidth'] <= result['innerWidth'] + 1, (width, result)
