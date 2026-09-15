from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

TARGETS = {
    'work': '.section-intro',
    'system': '.section-intro',
    'about': '.about-index',
    'contact': None,
}


def build_html():
    soup = BeautifulSoup((ROOT / 'index.html').read_text(encoding='utf-8'), 'html.parser')
    for tag in soup.find_all('script'):
        tag.decompose()
    for link in list(soup.find_all('link')):
        href = link.get('href', '')
        if href.startswith('css/'):
            style = soup.new_tag('style')
            style.string = (ROOT / href).read_text(encoding='utf-8')
            link.replace_with(style)
        else:
            link.decompose()
    classes = set(soup.html.get('class', []))
    classes.add('intro-resolved')
    soup.html['class'] = list(classes)
    script = soup.new_tag('script')
    script.string = (ROOT / 'js/app.js').read_text(encoding='utf-8')
    soup.body.append(script)
    return str(soup)


def assert_main_nav_framing(page, nav_selector):
    for section_id, focus_selector in TARGETS.items():
        page.set_content(build_html(), wait_until='load')
        page.emulate_media(reduced_motion='reduce')
        if nav_selector == '[data-mobile-nav]':
            page.locator('[data-menu-button]').click()
        page.locator(f'{nav_selector} a[href="#{section_id}"]').click()
        page.wait_for_timeout(80)
        metrics = page.evaluate("""({id, focusSelector}) => {
          const section = document.getElementById(id);
          const focus = focusSelector ? section.querySelector(focusSelector) : section;
          const topbar = document.querySelector('.topbar');
          return {
            hash: location.hash,
            topbarBottom: topbar.getBoundingClientRect().bottom,
            focusTop: focus.getBoundingClientRect().top,
            sectionTop: section.getBoundingClientRect().top,
          };
        }""", {'id': section_id, 'focusSelector': focus_selector})
        assert metrics['hash'] == f'#{section_id}', metrics
        assert metrics['focusTop'] >= metrics['topbarBottom'] + 8, metrics
        assert metrics['focusTop'] <= metrics['topbarBottom'] + 34, metrics
        # Previous chapter must not remain as a large visible band below the fixed header.
        # Contact intentionally frames the dark section boundary itself.
        if section_id == 'contact':
            assert metrics['sectionTop'] >= metrics['topbarBottom'] + 8, metrics
            assert metrics['sectionTop'] <= metrics['topbarBottom'] + 34, metrics
        else:
            assert metrics['sectionTop'] < metrics['topbarBottom'] + 4, metrics


def test_desktop_main_nav_frames_visual_chapter_start():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1584, 'height': 692})
        assert_main_nav_framing(page, '[data-desktop-nav]')
        browser.close()


def test_mobile_main_nav_frames_visual_chapter_start():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        assert_main_nav_framing(page, '[data-mobile-nav]')
        browser.close()
