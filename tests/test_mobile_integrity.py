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
    css = '\n'.join((ROOT/'css'/name).read_text(encoding='utf-8') for name in CSS_FILES)
    style = soup.new_tag('style'); style.string = css; soup.head.append(style)
    soup.html['class'] = ['intro-resolved']
    return str(soup)


async def audit_width(width, height):
    app_js = (ROOT/'js'/'app.js').read_text(encoding='utf-8')
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': width, 'height': height}, is_mobile=True, has_touch=True)
        errors = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        await page.set_content(build_document(), wait_until='domcontentloaded')
        await page.add_script_tag(content=app_js)
        await page.wait_for_timeout(50)

        base = await page.evaluate('''() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth })''')

        # Mobile menu must fit and lock background scroll.
        await page.locator('[data-menu-button]').click()
        menu = await page.evaluate('''() => {
          const m = document.querySelector('[data-mobile-menu]');
          const r = m.getBoundingClientRect();
          return { hidden: m.hidden, left:r.left, right:r.right, width:r.width,
                   expanded: document.querySelector('[data-menu-button]').getAttribute('aria-expanded'),
                   overflow: getComputedStyle(document.body).overflow };
        }''')
        await page.locator('[data-menu-button]').click()

        # Hero entry must open the explorer, then its final CTA must open the profile dialog.
        await page.locator('[data-hero-explore]').click()
        explorer = await page.evaluate('''() => {
          const p = document.querySelector('[data-explore-panel]'); const r=p.getBoundingClientRect();
          return {hidden:p.hidden,left:r.left,right:r.right,bottom:r.bottom,height:r.height};
        }''')
        await page.locator('[data-profile-map-open]').click()
        await page.wait_for_timeout(30)
        dialog = await page.evaluate('''() => {
          const d=document.querySelector('[data-profile-map]'); const r=d.getBoundingClientRect();
          return {open:d.open,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};
        }''')
        if dialog['open']:
            await page.locator('[data-profile-map-close]').click()

        # Final signal must be intentionally responsive, not a desktop-width strip clipped on phone.
        signal = await page.evaluate('''() => {
          const e=document.querySelector('.contact-signal'); const r=e.getBoundingClientRect();
          return {left:r.left,right:r.right,width:r.width,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,
                  whiteSpace:getComputedStyle(e).whiteSpace};
        }''')

        # System cards should stay in viewport even in selected/scaled state.
        await page.locator('#system').scroll_into_view_if_needed()
        await page.locator('.system-node').first.click()
        system = await page.evaluate('''() => [...document.querySelectorAll('.system-node')].map(e=>{
          const r=e.getBoundingClientRect(); return {left:r.left,right:r.right};
        })''')

        await browser.close()
        return base, menu, explorer, dialog, signal, system, errors


def test_mobile_integrity_320_to_430():
    async def run():
        for width, height in [(320,740),(360,800),(390,844),(430,932)]:
            base, menu, explorer, dialog, signal, system, errors = await audit_width(width, height)
            assert not errors, (width, errors)
            assert base['sw'] == base['iw'] == width, (width, base)
            assert menu['hidden'] is False and menu['expanded'] == 'true', (width, menu)
            assert menu['left'] >= -1 and menu['right'] <= width + 1, (width, menu)
            assert 'hidden' in menu['overflow'], (width, menu)
            assert explorer['hidden'] is False, (width, explorer)
            assert explorer['left'] >= 0 and explorer['right'] <= width, (width, explorer)
            assert dialog['open'] is True, (width, dialog)
            assert dialog['left'] >= 0 and dialog['right'] <= width, (width, dialog)
            assert signal['left'] >= 0 and signal['right'] <= width, (width, signal)
            assert signal['scrollWidth'] <= signal['clientWidth'] + 1, (width, signal)
            assert all(n['left'] >= -1 and n['right'] <= width + 1 for n in system), (width, system)
    asyncio.run(run())


def test_mobile_intro_blend_hides_skip_before_light_hero_finishes():
    css = (ROOT/'css'/'experience-intro.css').read_text(encoding='utf-8')
    js = (ROOT/'js'/'experience-intro.js').read_text(encoding='utf-8')
    assert 'intro-blending .experience-intro__skip' in css
    assert 'skip-blend' in js or "skip.style" in js or 'data-intro-skip' in js
