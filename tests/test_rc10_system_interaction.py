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
    soup = BeautifulSoup((BASE / 'index.html').read_text(), 'html.parser')
    for tag in soup.find_all(['script', 'link']):
        if tag.name == 'link' and tag.get('rel') and 'stylesheet' not in tag.get('rel'):
            continue
        tag.decompose()
    css = '\n'.join((BASE / 'css' / name).read_text() for name in CSS_FILES)
    style = soup.new_tag('style')
    style.string = css
    soup.head.append(style)
    script = soup.new_tag('script')
    script.string = (BASE / 'js' / 'app.js').read_text()
    soup.body.append(script)
    return str(soup)


def snapshot(page):
    return page.evaluate('''() => ({
      step: document.querySelector('[data-system-engine]').dataset.activeStep,
      title: document.querySelector('[data-system-projects-title]').textContent.trim(),
      pressed: [...document.querySelectorAll('[data-system-node]')].map(n => n.getAttribute('aria-pressed')),
      selected: [...document.querySelectorAll('[data-system-node]')].map(n => n.classList.contains('is-selected')),
      preview: [...document.querySelectorAll('[data-system-node]')].map(n => n.classList.contains('is-preview')),
      live: document.querySelector('[data-system-projects]').getAttribute('aria-live'),
    })''')


def test_hover_previews_without_committing_and_reverts_to_selection():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1366, 'height': 768})
        page.set_content(build_document(), wait_until='domcontentloaded')
        nodes = page.locator('[data-system-node]')

        initial = snapshot(page)
        nodes.nth(1).dispatch_event('pointerenter', {'pointerType': 'mouse'})
        preview = snapshot(page)
        nodes.nth(1).dispatch_event('pointerleave', {'pointerType': 'mouse'})
        restored = snapshot(page)
        browser.close()

    assert initial['pressed'] == ['true', 'false', 'false', 'false'], initial
    assert preview['step'] == '1' and preview['title'] == 'Estructura', preview
    assert preview['pressed'] == ['true', 'false', 'false', 'false'], preview
    assert preview['selected'] == [True, False, False, False], preview
    assert preview['preview'] == [False, True, False, False], preview
    assert restored['step'] == '0' and restored['title'] == 'Señales', restored
    assert restored['preview'] == [False, False, False, False], restored


def test_click_commits_and_future_hover_returns_to_committed_step():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1366, 'height': 768})
        page.set_content(build_document(), wait_until='domcontentloaded')
        nodes = page.locator('[data-system-node]')

        nodes.nth(1).click()
        committed = snapshot(page)
        nodes.nth(2).dispatch_event('pointerenter', {'pointerType': 'mouse'})
        preview = snapshot(page)
        nodes.nth(2).dispatch_event('pointerleave', {'pointerType': 'mouse'})
        restored = snapshot(page)
        browser.close()

    assert committed['pressed'] == ['false', 'true', 'false', 'false'], committed
    assert committed['title'] == 'Estructura' and committed['step'] == '1', committed
    assert preview['pressed'] == ['false', 'true', 'false', 'false'], preview
    assert preview['title'] == 'Interfaz' and preview['step'] == '2', preview
    assert restored['title'] == 'Estructura' and restored['step'] == '1', restored


def test_keyboard_focus_previews_enter_commits_and_projects_region_is_not_live():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1024, 'height': 768})
        page.set_content(build_document(), wait_until='domcontentloaded')
        nodes = page.locator('[data-system-node]')

        nodes.nth(3).focus()
        focused = snapshot(page)
        nodes.nth(3).press('Enter')
        committed = snapshot(page)
        browser.close()

    assert focused['title'] == 'Aprender' and focused['step'] == '3', focused
    assert focused['pressed'] == ['true', 'false', 'false', 'false'], focused
    assert committed['pressed'] == ['false', 'false', 'false', 'true'], committed
    assert committed['title'] == 'Aprender', committed
    assert committed['live'] in (None, 'off'), committed


def test_selected_state_never_scales_on_tablet_or_mobile():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        results = []
        for width, height in [(768, 1024), (390, 844)]:
            page = browser.new_page(viewport={'width': width, 'height': height})
            page.set_content(build_document(), wait_until='domcontentloaded')
            result = page.evaluate('''() => {
              const node = document.querySelector('[data-system-node]');
              node.classList.add('is-selected');
              node.setAttribute('aria-pressed', 'true');
              const transform = getComputedStyle(node).transform;
              if (transform === 'none') return { transform, scaleX: 1, scaleY: 1 };
              const m = new DOMMatrixReadOnly(transform);
              return { transform, scaleX: m.a, scaleY: m.d };
            }''')
            results.append((width, result))
            page.close()
        browser.close()

    for width, result in results:
        assert abs(result['scaleX'] - 1) < 0.001, (width, result)
        assert abs(result['scaleY'] - 1) < 0.001, (width, result)


if __name__ == '__main__':
    test_hover_previews_without_committing_and_reverts_to_selection()
    test_click_commits_and_future_hover_returns_to_committed_step()
    test_keyboard_focus_previews_enter_commits_and_projects_region_is_not_live()
    test_selected_state_never_scales_on_tablet_or_mobile()
    print('PASS')


def test_project_connections_get_a_short_native_transition_but_reduced_motion_does_not():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])

        page = browser.new_page(viewport={'width': 1366, 'height': 768})
        page.set_content(build_document(), wait_until='domcontentloaded')
        page.locator('[data-system-node]').nth(1).click()
        motion = page.evaluate('''() => ({
          title: document.querySelector('[data-system-projects-title]').getAnimations().map(a => a.effect.getTiming().duration),
          list: document.querySelector('[data-system-projects-list]').getAnimations().map(a => a.effect.getTiming().duration),
        })''')
        page.close()

        reduced = browser.new_page(viewport={'width': 1366, 'height': 768}, reduced_motion='reduce')
        reduced.set_content(build_document(), wait_until='domcontentloaded')
        reduced.locator('[data-system-node]').nth(1).click()
        reduced_motion = reduced.evaluate('''() => ({
          title: document.querySelector('[data-system-projects-title]').getAnimations().length,
          list: document.querySelector('[data-system-projects-list]').getAnimations().length,
        })''')
        reduced.close()
        browser.close()

    assert motion['title'] and motion['list'], motion
    assert max(motion['title'] + motion['list']) <= 260, motion
    assert reduced_motion == {'title': 0, 'list': 0}, reduced_motion
