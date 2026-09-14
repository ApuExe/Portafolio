from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
VIEWPORT = {"width": 1904, "height": 861}
CSS_FILES = [
    'style.css', 'stability.css', 'interactive.css',
    'design-system.css', 'motion-system.css', 'experience-intro.css'
]


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


def test_system_cards_are_fully_framed_inside_stage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport=VIEWPORT)
        page.emulate_media(reduced_motion='reduce')
        page.set_content(build_html(), wait_until='load')
        page.locator('#system').scroll_into_view_if_needed()
        page.wait_for_timeout(50)
        metrics = page.evaluate('''() => {
          const stage = document.querySelector('.system-engine-stage').getBoundingClientRect();
          const nodes = [...document.querySelectorAll('.system-node')].map(node => {
            const r = node.getBoundingClientRect();
            const cs = getComputedStyle(node);
            return {
              left: r.left, right: r.right, top: r.top, bottom: r.bottom,
              borderLeft: parseFloat(cs.borderLeftWidth),
              borderRight: parseFloat(cs.borderRightWidth),
              borderBottom: parseFloat(cs.borderBottomWidth),
              scrollWidth: node.scrollWidth,
              clientWidth: node.clientWidth,
              scrollHeight: node.scrollHeight,
              clientHeight: node.clientHeight,
            };
          });
          return { stage: {left: stage.left, right: stage.right, top: stage.top, bottom: stage.bottom}, nodes };
        }''')
        browser.close()

    for node in metrics['nodes']:
        assert node['left'] >= metrics['stage']['left'] + 18, metrics
        assert node['right'] <= metrics['stage']['right'] - 18, metrics
        assert node['borderLeft'] >= 1 and node['borderRight'] >= 1 and node['borderBottom'] >= 1, metrics
        assert node['scrollWidth'] <= node['clientWidth'] + 1, metrics
        assert node['scrollHeight'] <= node['clientHeight'] + 1, metrics


def test_contact_nav_does_not_leave_large_white_gap_above_section():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport=VIEWPORT)
        page.emulate_media(reduced_motion='reduce')
        page.set_content(build_html(), wait_until='load')
        page.locator('.desktop-nav a[href="#contact"]').click()
        page.wait_for_timeout(50)
        metrics = page.evaluate('''() => {
          const topbar = document.querySelector('.topbar').getBoundingClientRect();
          const contact = document.querySelector('#contact').getBoundingClientRect();
          return { topbarBottom: topbar.bottom, contactTop: contact.top };
        }''')
        browser.close()

    gap = metrics['contactTop'] - metrics['topbarBottom']
    assert gap >= 8, metrics
    assert gap <= 42, metrics


def test_profile_to_contact_transition_is_compact():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport=VIEWPORT)
        page.set_content(build_html(), wait_until='load')
        metrics = page.evaluate("""() => {
          const grid = document.querySelector('.profile-grid-refined').getBoundingClientRect();
          const contact = document.querySelector('#contact').getBoundingClientRect();
          return { gap: contact.top - grid.bottom };
        }""")
        browser.close()
    assert metrics['gap'] <= 96, metrics


def test_contact_monogram_is_decorative_and_does_not_push_content():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport=VIEWPORT)
        page.set_content(build_html(), wait_until='load')
        metrics = page.evaluate("""() => {
          const contact = document.querySelector('#contact').getBoundingClientRect();
          const monogram = document.querySelector('.contact-monogram');
          const index = document.querySelector('.contact-index').getBoundingClientRect();
          const title = document.querySelector('.contact-content h2').getBoundingClientRect();
          return {
            monogramPosition: getComputedStyle(monogram).position,
            indexOffset: index.top - contact.top,
            titleOffset: title.top - contact.top,
          };
        }""")
        browser.close()
    assert metrics['monogramPosition'] == 'absolute', metrics
    assert metrics['indexOffset'] <= 220, metrics
    assert metrics['titleOffset'] <= 360, metrics


def test_mobile_system_cards_do_not_inherit_browser_button_box():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.set_content(build_html(), wait_until='load')
        borders = page.evaluate("""() => [...document.querySelectorAll('.system-node')].map(node => {
          const cs = getComputedStyle(node);
          return {
            left: parseFloat(cs.borderLeftWidth),
            right: parseFloat(cs.borderRightWidth),
            bottom: parseFloat(cs.borderBottomWidth),
            top: parseFloat(cs.borderTopWidth),
          };
        })""")
        browser.close()
    for border in borders:
        assert border['left'] == 0, borders
        assert border['right'] == 0, borders
        assert border['bottom'] == 0, borders
        assert border['top'] >= 1, borders


if __name__ == '__main__':
    test_system_cards_are_fully_framed_inside_stage()
    test_contact_nav_does_not_leave_large_white_gap_above_section()
    test_profile_to_contact_transition_is_compact()
    test_contact_monogram_is_decorative_and_does_not_push_content()
    test_mobile_system_cards_do_not_inherit_browser_button_box()
    print('PASS')
