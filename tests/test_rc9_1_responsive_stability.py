import asyncio
from pathlib import Path

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
CSS_FILES = [
    'style.css',
    'stability.css',
    'interactive.css',
    'design-system.css',
    'motion-system.css',
    'case-choreography.css',
    'experience-intro.css',
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


async def audit(width, height=900):
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            executable_path='/usr/bin/chromium',
            args=['--no-sandbox'],
        )
        page = await browser.new_page(viewport={'width': width, 'height': height})
        await page.set_content(build_document(), wait_until='domcontentloaded')
        result = await page.evaluate('''() => {
          const figures = [...document.querySelectorAll('.sunafil-documentary-grid figure')]
            .map((el) => {
              const r = el.getBoundingClientRect();
              return { left: r.left, right: r.right, width: r.width };
            });
          const signal = document.querySelector('.contact-signal');
          const sr = signal.getBoundingClientRect();
          return {
            viewport: innerWidth,
            figures,
            signal: {
              left: sr.left,
              right: sr.right,
              width: sr.width,
              whiteSpace: getComputedStyle(signal).whiteSpace,
              flexWrap: getComputedStyle(signal).flexWrap,
            },
          };
        }''')
        await browser.close()
        return result


def test_sunafil_grid_stays_inside_viewport_at_tablet_and_laptop_widths():
    async def run():
        for width in (840, 1024):
            result = await audit(width)
            assert all(
                figure['left'] >= -1 and figure['right'] <= width + 1
                for figure in result['figures']
            ), (width, result['figures'])

    asyncio.run(run())


def test_contact_signal_wraps_in_small_tablet_range():
    async def run():
        result = await audit(600)
        signal = result['signal']
        assert signal['left'] >= -1 and signal['right'] <= result['viewport'] + 1, signal
        assert signal['whiteSpace'] == 'normal', signal
        assert signal['flexWrap'] == 'wrap', signal

    asyncio.run(run())
