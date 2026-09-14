from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


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


def main():
    html = build_html()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1584, 'height': 1080})
        page.set_content(html, wait_until='load')

        # Reproduces the real 3/4 bug: TKOH is too tall for the old 18% threshold.
        for case_id in ('case-tkoh', 'case-amp', 'case-20prod', 'case-visual'):
            page.locator(f'#{case_id} .exp-head').scroll_into_view_if_needed()
            page.wait_for_timeout(180)
        count = page.locator('[data-discovery-count]').inner_text()
        assert count == '4/4', f'expected 4/4 after visiting every case header, got {count}'

        # The explorer's final action must lead to real profile content, not a dead-end overlay.
        page.locator('[data-explore-toggle]').click()
        action = page.locator('[data-profile-map-open]')
        assert action.evaluate("el => el.tagName === 'A'"), 'final explorer action is not a link'
        assert action.get_attribute('href') == '#about', 'final explorer action does not point to #about'
        action.click()
        page.wait_for_timeout(1300)
        assert page.evaluate('location.hash') == '#about', 'profile action did not update the URL hash'
        about_top = page.locator('#about').evaluate('el => Math.abs(el.getBoundingClientRect().top)')
        assert about_top < 220, f'profile action did not navigate to #about (top distance {about_top})'

        browser.close()


if __name__ == '__main__':
    main()
