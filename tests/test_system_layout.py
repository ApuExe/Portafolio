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
    script = soup.new_tag('script')
    script.string = (BASE / 'js' / 'motion-system.js').read_text()
    soup.body.append(script)
    return str(soup)


async def run_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path='/usr/bin/chromium',
            args=['--no-sandbox', '--disable-gpu'],
        )
        page = await browser.new_page(viewport={'width': 1584, 'height': 692})
        await page.set_content(build_document(), wait_until='domcontentloaded')
        await page.locator('#system').scroll_into_view_if_needed()
        await page.wait_for_timeout(80)

        result = await page.evaluate('''() => {
          const stage = document.querySelector('.system-engine-stage').getBoundingClientRect();
          const core = document.querySelector('.system-core').getBoundingClientRect();
          const nodes = [...document.querySelectorAll('.system-node')].map((node) => {
            const rect = node.getBoundingClientRect();
            return {
              title: node.querySelector('h3')?.textContent || '',
              position: getComputedStyle(node).position,
              top: rect.top,
              bottom: rect.bottom,
              left: rect.left,
              right: rect.right,
            };
          });
          return { stage: { top: stage.top, bottom: stage.bottom }, core: { top: core.top, bottom: core.bottom, left: core.left, right: core.right }, nodes };
        }''')
        await browser.close()

    positions = [node['position'] for node in result['nodes']]
    assert positions == ['absolute'] * 4, f'System nodes lost absolute positioning: {positions}'

    top_nodes = result['nodes'][:2]
    bottom_nodes = result['nodes'][2:]
    assert all(node['bottom'] <= result['core']['top'] + 80 for node in top_nodes), result
    assert all(node['top'] >= result['core']['bottom'] - 80 for node in bottom_nodes), result

    def intersects(a, b):
        return not (a['right'] <= b['left'] or a['left'] >= b['right'] or a['bottom'] <= b['top'] or a['top'] >= b['bottom'])

    assert not any(intersects(node, result['core']) for node in result['nodes']), result

    print('PASS: desktop system nodes keep spatial positioning at 1584x692 with no core overlap')


if __name__ == '__main__':
    asyncio.run(run_test())
