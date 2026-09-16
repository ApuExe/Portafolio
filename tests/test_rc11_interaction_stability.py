from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parents[1]
CSS_FILES = [
    'style.css', 'stability.css', 'interactive.css', 'design-system.css',
    'motion-system.css', 'case-choreography.css', 'profile-closing.css',
    'experience-intro.css'
]


def build_document():
    soup = BeautifulSoup((BASE / 'index.html').read_text(encoding='utf-8'), 'html.parser')
    for script in list(soup.find_all('script')):
        script.decompose()
    for link in list(soup.find_all('link', rel='stylesheet')):
        link.decompose()
    style = soup.new_tag('style')
    style.string = '\n'.join((BASE / 'css' / name).read_text(encoding='utf-8') for name in CSS_FILES)
    soup.head.append(style)
    soup.html['class'] = ['intro-resolved']
    return str(soup)


def pseudo_target(page, selector, pseudo='::after'):
    return page.evaluate('''([selector, pseudo]) => {
      const el = document.querySelector(selector);
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el, pseudo);
      return {
        elementWidth: r.width,
        elementHeight: r.height,
        pseudoContent: cs.content,
        pseudoWidth: cs.width,
        pseudoHeight: cs.height,
        pseudoPosition: cs.position,
        pseudoPointerEvents: cs.pointerEvents,
      };
    }''', [selector, pseudo])


def test_rc11_expands_small_targets_without_resizing_visual_controls():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page.set_content(build_document(), wait_until='domcontentloaded')

        # The close control should preserve the existing 30px visual footprint.
        page.locator('[data-profile-map]').evaluate('(d) => d.showModal()')
        close = pseudo_target(page, '[data-profile-map-close]')
        assert close['elementWidth'] <= 32 and close['elementHeight'] <= 32, close
        assert close['pseudoContent'] not in ('none', 'normal', ''), close
        assert float(close['pseudoHeight'].replace('px', '')) >= 44, close
        assert float(close['pseudoWidth'].replace('px', '')) >= 44, close
        page.locator('[data-profile-map]').evaluate('(d) => d.close()')

        # Editorial controls keep their visual typography but gain a 44px touch layer.
        selectors = [
            '#case-tkoh .exp-head a',
            '#case-tkoh [data-pdf-open]',
            '#case-tkoh .exp-resource-actions a',
            '.contact-direct-email',
            'footer a[href="#top"]',
        ]
        for selector in selectors:
            page.locator(selector).scroll_into_view_if_needed()
            info = pseudo_target(page, selector)
            assert info['pseudoContent'] not in ('none', 'normal', ''), (selector, info)
            assert float(info['pseudoHeight'].replace('px', '')) >= 44, (selector, info)
            assert info['pseudoPosition'] == 'absolute', (selector, info)

        browser.close()


def test_rc11_extended_hit_areas_receive_pointer_events_outside_visual_box():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        page.set_content(build_document(), wait_until='domcontentloaded')

        # Use an isolated close control: 7px outside a 30px visual box is still inside 44px.
        page.locator('[data-profile-map]').evaluate('(d) => d.showModal()')
        btn = page.locator('[data-profile-map-close]')
        box = btn.bounding_box()
        page.evaluate('''() => {
          window.__rc11Hit = false;
          document.querySelector('[data-profile-map-close]').addEventListener('pointerdown', () => window.__rc11Hit = true, {once:true});
        }''')
        page.mouse.click(box['x'] + box['width'] / 2, box['y'] - 6)
        hit = page.evaluate('window.__rc11Hit')
        assert hit is True, {'box': box, 'hit': hit}

        browser.close()


def test_rc11_focus_contract_remains_visible_for_expanded_targets():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 390, 'height': 844})
        page.set_content(build_document(), wait_until='domcontentloaded')
        for selector in ['#case-tkoh .exp-head a', '.contact-direct-email', 'footer a[href="#top"]']:
            page.locator(selector).scroll_into_view_if_needed()
            page.locator(selector).focus()
            outline = page.locator(selector).evaluate('(el) => getComputedStyle(el).outlineStyle')
            assert outline != 'none', (selector, outline)
        browser.close()
