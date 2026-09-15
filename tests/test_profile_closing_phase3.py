import asyncio
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE_CSS = ['style.css','stability.css','interactive.css','design-system.css','motion-system.css','case-choreography.css','experience-intro.css']


def test_phase3_assets_are_wired_and_preserve_copy():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    assert 'css/profile-closing.css' in html
    assert 'js/profile-closing.js' in html
    assert 'No llegué a producto desde una sola disciplina.' in html
    assert 'YA VISTE' in html and 'CÓMO PIENSO.' in html


def build_document():
    soup = BeautifulSoup((ROOT/'index.html').read_text(encoding='utf-8'), 'html.parser')
    for script in list(soup.find_all('script')):
        script.decompose()
    for link in list(soup.find_all('link', rel='stylesheet')):
        link.decompose()
    css_files = BASE_CSS + ['profile-closing.css']
    style = soup.new_tag('style')
    style.string = '\n'.join((ROOT/'css'/name).read_text(encoding='utf-8') for name in css_files)
    soup.head.append(style)
    soup.html['class'] = ['intro-resolved']
    return str(soup)


async def audit(width, height, touch=False):
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = await browser.new_page(
            viewport={'width': width, 'height': height},
            is_mobile=touch,
            has_touch=touch,
        )
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        await page.set_content(build_document(), wait_until='domcontentloaded')
        await page.add_script_tag(content=(ROOT/'js'/'profile-closing.js').read_text(encoding='utf-8'))

        await page.locator('#about').scroll_into_view_if_needed()
        await page.wait_for_timeout(220)
        profile = await page.evaluate('''() => {
          const section = document.querySelector('#about');
          const lenses = [...document.querySelectorAll('[data-profile-lens]')];
          const r = section.getBoundingClientRect();
          return {
            active: section.classList.contains('profile-story-active'),
            progress: getComputedStyle(section).getPropertyValue('--profile-thread-progress').trim(),
            lensCount: lenses.length,
            sw: document.documentElement.scrollWidth,
            iw: innerWidth,
            left: r.left,
            right: r.right
          };
        }''')

        await page.locator('#contact').scroll_into_view_if_needed()
        await page.wait_for_timeout(220)
        contact = await page.evaluate('''() => {
          const section = document.querySelector('#contact');
          const signal = section.querySelector('.contact-signal');
          const r = signal.getBoundingClientRect();
          return {
            active: section.classList.contains('closing-live'),
            sw: document.documentElement.scrollWidth,
            iw: innerWidth,
            signalLeft: r.left,
            signalRight: r.right,
            closeX: getComputedStyle(section).getPropertyValue('--closing-x').trim(),
            closeY: getComputedStyle(section).getPropertyValue('--closing-y').trim()
          };
        }''')

        if not touch:
            box = await page.locator('#contact').bounding_box()
            await page.mouse.move(box['x'] + box['width'] * .72, box['y'] + min(box['height'] * .32, height * .5))
            await page.wait_for_timeout(70)
            pointer = await page.evaluate('''() => ({
              x: getComputedStyle(document.querySelector('#contact')).getPropertyValue('--closing-x').trim(),
              y: getComputedStyle(document.querySelector('#contact')).getPropertyValue('--closing-y').trim()
            })''')
        else:
            pointer = {'x': contact['closeX'], 'y': contact['closeY']}

        await browser.close()
    return errors, profile, contact, pointer


def test_profile_and_contact_runtime_desktop_and_mobile():
    async def run():
        for width, height, touch in [(1440,900,False),(430,932,True),(390,844,True),(320,740,True)]:
            errors, profile, contact, pointer = await audit(width, height, touch)
            assert not errors, (width, errors)
            assert profile['active'] is True, (width, profile)
            assert profile['lensCount'] == 3, (width, profile)
            assert profile['sw'] == profile['iw'] == width, (width, profile)
            assert contact['active'] is True, (width, contact)
            assert contact['sw'] == contact['iw'] == width, (width, contact)
            if touch:
                assert contact['signalLeft'] >= -1 and contact['signalRight'] <= width + 1, (width, contact)
            if not touch:
                assert pointer['x'] != '50%' or pointer['y'] != '42%', pointer
    asyncio.run(run())


def test_profile_closing_reduced_motion_contract():
    css = (ROOT/'css'/'profile-closing.css').read_text(encoding='utf-8')
    js = (ROOT/'js'/'profile-closing.js').read_text(encoding='utf-8')
    assert '@media (prefers-reduced-motion: reduce)' in css
    assert 'prefers-reduced-motion: reduce' in js
    assert 'IntersectionObserver' in js
    assert 'requestAnimationFrame' in js
    assert '.contact-section.closing-live.closing-visible .contact-signal span' in css
