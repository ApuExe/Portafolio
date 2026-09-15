import asyncio
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
CSS_FILES = ['style.css','stability.css','interactive.css','design-system.css','motion-system.css','case-choreography.css','experience-intro.css']


def build_document():
    soup = BeautifulSoup((ROOT/'index.html').read_text(encoding='utf-8'), 'html.parser')
    for script in list(soup.find_all('script')):
        script.decompose()
    for link in list(soup.find_all('link', rel='stylesheet')):
        link.decompose()
    style = soup.new_tag('style')
    style.string = '\n'.join((ROOT/'css'/name).read_text(encoding='utf-8') for name in CSS_FILES)
    soup.head.append(style)
    soup.html['class'] = ['intro-resolved']
    return str(soup)


async def run_width(width, height):
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width':width,'height':height}, is_mobile=width <= 760, has_touch=width <= 760)
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        await page.set_content(build_document(), wait_until='domcontentloaded')
        await page.add_script_tag(content=(ROOT/'js'/'app.js').read_text(encoding='utf-8'))
        await page.add_script_tag(content=(ROOT/'js'/'motion-system.js').read_text(encoding='utf-8'))
        await page.add_script_tag(content=(ROOT/'js'/'case-choreography.js').read_text(encoding='utf-8'))

        states = []
        for cid in ['case-tkoh','case-amp','case-20prod','case-visual']:
            bridge = page.locator(f'#{cid} .case-bridge')
            await bridge.scroll_into_view_if_needed()
            await page.wait_for_timeout(180)
            state = await page.evaluate('''id => {
              const section = document.getElementById(id);
              const bridge = section.querySelector('.case-bridge');
              return {
                active: section.classList.contains('choreo-active'),
                bridgeActive: bridge.classList.contains('is-bridge-active'),
                scrollWidth: document.documentElement.scrollWidth,
                innerWidth: innerWidth
              };
            }''', cid)
            states.append(state)
        await browser.close()
    return errors, states


def test_case_choreography_runtime_desktop_and_mobile():
    async def run():
        for width, height in [(1440,900),(430,932),(390,844),(360,800),(320,740)]:
            errors, states = await run_width(width, height)
            assert not errors, (width, errors)
            for state in states:
                assert state['active'] is True, (width, state)
                assert state['bridgeActive'] is True, (width, state)
                assert state['scrollWidth'] == state['innerWidth'] == width, (width, state)
    asyncio.run(run())
