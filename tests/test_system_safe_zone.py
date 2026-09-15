import asyncio
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

BASE = Path(__file__).resolve().parents[1]
CSS_FILES = [
    'style.css', 'stability.css', 'interactive.css',
    'design-system.css', 'motion-system.css', 'experience-intro.css'
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
    return str(soup)


async def inspect(page):
    return await page.evaluate('''() => {
      const rect = el => { const r = el.getBoundingClientRect(); return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}; };
      const coreEl = document.querySelector('.system-core');
      const orbitEl = document.querySelector('.system-engine-orbit');
      const nodeEls = [...document.querySelectorAll('.system-node')];
      const inactive = nodeEls[1];
      const active = nodeEls[0];
      active.classList.add('is-selected');
      return {
        core: rect(coreEl),
        orbit: getComputedStyle(orbitEl).display === 'none' ? null : rect(orbitEl),
        nodes: nodeEls.map(el => ({...rect(el), opacity: Number(getComputedStyle(el).opacity), fontSize: parseFloat(getComputedStyle(el.querySelector('h3')).fontSize)})),
        activeOpacity: Number(getComputedStyle(active).opacity),
        inactiveOpacity: Number(getComputedStyle(inactive).opacity),
        columns: getComputedStyle(document.querySelector('.system-nodes')).gridTemplateColumns,
      };
    }''')


async def run_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox', '--disable-gpu'])
        html = build_document()
        desktop_results = []
        for width, height in [(1584, 692), (1366, 768), (1024, 768), (981, 768)]:
            page = await browser.new_page(viewport={'width': width, 'height': height})
            await page.set_content(html, wait_until='domcontentloaded')
            await page.locator('#system').scroll_into_view_if_needed()
            await page.wait_for_timeout(50)
            desktop_results.append((width, height, await inspect(page)))
            await page.close()

        page = await browser.new_page(viewport={'width': 390, 'height': 844})
        await page.set_content(html, wait_until='domcontentloaded')
        await page.locator('#system').scroll_into_view_if_needed()
        await page.wait_for_timeout(50)
        mobile = await inspect(page)
        await page.close()
        await browser.close()

    for width, height, result in desktop_results:
        assert result['core']['width'] <= 252, f'{width}x{height}: core too dominant: {result["core"]}'
        assert all(node['width'] <= 258 for node in result['nodes']), f'{width}x{height}: peripheral cards too wide: {result["nodes"]}'
        assert 0.40 <= result['inactiveOpacity'] <= 0.50, f'{width}x{height}: inactive hierarchy not readable: {result["inactiveOpacity"]}'
        assert result['activeOpacity'] >= 0.99, f'{width}x{height}: active node lacks emphasis: {result["activeOpacity"]}'
        if result['orbit']:
            left_nodes = [result['nodes'][0], result['nodes'][3]]
            right_nodes = [result['nodes'][1], result['nodes'][2]]
            left_gap = min(result['orbit']['left'] - n['right'] for n in left_nodes)
            right_gap = min(n['left'] - result['orbit']['right'] for n in right_nodes)
            assert left_gap >= 56, f'{width}x{height}: left safe zone only {left_gap:.1f}px'
            assert right_gap >= 56, f'{width}x{height}: right safe zone only {right_gap:.1f}px'

    assert mobile['orbit'] is None, 'phone layout should remove orbital geometry'
    assert mobile['core']['width'] <= 280, f'phone core too wide: {mobile["core"]}'
    assert mobile['nodes'][0]['width'] <= 390, 'phone node escapes viewport'

    print('PASS: Mi Sistema keeps a clear central safe zone and peripheral hierarchy across desktop + phone')


if __name__ == '__main__':
    asyncio.run(run_test())
