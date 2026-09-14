from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
VIEWPORT = {"width": 1584, "height": 692}
CASES = ["case-tkoh", "case-amp", "case-20prod", "case-visual"]


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


def test_selected_work_links_frame_experience_header_below_topbar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport=VIEWPORT)
        page.emulate_media(reduced_motion='reduce')

        for case_id in CASES:
            page.set_content(build_html(), wait_until='load')
            page.locator(f'a.project-link[href="#{case_id}"]').click()
            page.wait_for_timeout(80)
            metrics = page.evaluate("""(id) => {
              const section = document.getElementById(id);
              const main = section.querySelector('.exp-hero-main');
              const title = section.querySelector('.exp-hero h2');
              const topbar = document.querySelector('.topbar');
              return {
                hash: location.hash,
                topbarBottom: topbar.getBoundingClientRect().bottom,
                mainTop: main.getBoundingClientRect().top,
                titleTop: title.getBoundingClientRect().top,
              };
            }""", case_id)
            assert metrics['hash'] == f'#{case_id}'
            assert metrics['mainTop'] >= metrics['topbarBottom'] + 8, metrics
            assert metrics['mainTop'] <= metrics['topbarBottom'] + 42, metrics
            assert metrics['titleTop'] <= metrics['topbarBottom'] + 90, metrics
        browser.close()
