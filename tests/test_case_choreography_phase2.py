import asyncio
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
CSS_FILES = [
    'style.css', 'stability.css', 'interactive.css', 'design-system.css',
    'motion-system.css', 'case-choreography.css', 'experience-intro.css'
]


def build_document():
    soup = BeautifulSoup(HTML, 'html.parser')
    for script in list(soup.find_all('script')):
        script.decompose()
    for link in list(soup.find_all('link', rel='stylesheet')):
        link.decompose()
    style = soup.new_tag('style')
    style.string = '\n'.join((ROOT / 'css' / name).read_text(encoding='utf-8') for name in CSS_FILES)
    soup.head.append(style)
    soup.html['class'] = ['intro-resolved']
    return str(soup)


def test_phase2_contract_is_present_in_source():
    js = (ROOT / 'js' / 'case-choreography.js').read_text(encoding='utf-8')
    css = (ROOT / 'css' / 'case-choreography.css').read_text(encoding='utf-8')

    for dialect in ['build-system', 'follow-signal', 'editorial-composition', 'human-context']:
        assert dialect in js

    for token in [
        'case-handoff', 'is-story-step-active', 'tkoh-build-frame',
        'amp-signal-runner', 'is-signal-step', 'has-signal-focus',
        '--piece-x', '--piece-y', 'has-documentary-focus', 'is-documentary-focus'
    ]:
        assert token in (js + css), token

    for next_domain in ['MARKETING / DATOS', 'COMUNICACIÓN VISUAL', 'CONTEXTO / PERSONAS', 'MI SISTEMA / SÍNTESIS']:
        assert next_domain in js

    forbidden = ['ScrollTrigger', 'scrub:', 'pin:', "addEventListener('wheel'", 'preventDefault() // scroll']
    assert not any(token in js for token in forbidden)


async def inspect_desktop():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        await page.set_content(build_document(), wait_until='domcontentloaded')
        await page.add_script_tag(content=(ROOT / 'js' / 'app.js').read_text(encoding='utf-8'))
        await page.add_script_tag(content=(ROOT / 'js' / 'motion-system.js').read_text(encoding='utf-8'))
        await page.add_script_tag(content=(ROOT / 'js' / 'case-choreography.js').read_text(encoding='utf-8'))

        # Shared story sequencing + handoff contract.
        shared = []
        for cid in ['case-tkoh', 'case-amp', 'case-20prod', 'case-visual']:
            await page.locator(f'#{cid} .story-line').scroll_into_view_if_needed()
            await page.wait_for_timeout(900)
            await page.locator(f'#{cid} .case-handoff').scroll_into_view_if_needed()
            await page.wait_for_timeout(360)
            shared.append(await page.evaluate('''id => {
              const section = document.getElementById(id);
              const story = section.querySelector('.story-line');
              const handoff = section.querySelector('.case-handoff');
              return {
                dialect: section.dataset.caseDialect || '',
                storyCount: story.querySelectorAll('span, i').length,
                storyActive: story.querySelectorAll('.is-story-step-active').length,
                handoff: !!handoff,
                handoffActive: handoff?.classList.contains('is-handoff-active') || false,
                nextDomain: section.dataset.caseNextDomain || ''
              };
            }''', cid))

        # TKOH frame and desktop depth.
        await page.locator('#case-tkoh .exp-stage-product').scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        tkoh = await page.evaluate('''() => {
          const stage = document.querySelector('#case-tkoh .exp-stage-product');
          const r = stage.getBoundingClientRect();
          stage.dispatchEvent(new PointerEvent('pointermove', {
            bubbles: true,
            clientX: r.left + r.width * .85,
            clientY: r.top + r.height * .22,
            pointerType: 'mouse'
          }));
          return {
            frameEdges: stage.querySelectorAll('.tkoh-build-frame > i').length,
            buildActive: stage.classList.contains('is-build-active'),
            x: stage.style.getPropertyValue('--tkoh-depth-x'),
            y: stage.style.getPropertyValue('--tkoh-depth-y')
          };
        }''')

        # Amazon one-shot signal and pointer focus.
        await page.locator('#case-amp .amp-journey-list').scroll_into_view_if_needed()
        await page.wait_for_timeout(1200)
        await page.locator('#case-amp .amp-journey-list article').nth(1).hover()
        amp = await page.evaluate('''() => {
          const list = document.querySelector('#case-amp .amp-journey-list');
          return {
            runner: !!list.querySelector('.amp-signal-runner'),
            stepCount: list.querySelectorAll('article.is-signal-step').length,
            focused: list.querySelectorAll('article.is-signal-focus').length,
            hasFocus: list.classList.contains('has-signal-focus')
          };
        }''')

        # 20 Prod. board depth.
        await page.locator('#case-20prod .prod-social-images').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        editorial = await page.evaluate('''() => {
          const board = document.querySelector('#case-20prod .prod-social-images');
          const r = board.getBoundingClientRect();
          board.dispatchEvent(new PointerEvent('pointermove', {
            bubbles: true,
            clientX: r.left + r.width * .82,
            clientY: r.top + r.height * .28,
            pointerType: 'mouse'
          }));
          const figs = [...board.querySelectorAll('figure')];
          return figs.map(fig => ({
            x: fig.style.getPropertyValue('--piece-x'),
            y: fig.style.getPropertyValue('--piece-y')
          }));
        }''')

        # SUNAFIL documentary focus.
        await page.locator('#case-visual .sunafil-documentary-grid').scroll_into_view_if_needed()
        await page.wait_for_timeout(500)
        await page.locator('#case-visual .sunafil-documentary-grid figure').nth(1).hover()
        documentary = await page.evaluate('''() => {
          const grid = document.querySelector('#case-visual .sunafil-documentary-grid');
          return {
            gridFocus: grid.classList.contains('has-documentary-focus'),
            selected: grid.querySelectorAll('figure.is-documentary-focus').length
          };
        }''')

        overflow = await page.evaluate('''() => ({sw: document.documentElement.scrollWidth, iw: innerWidth})''')
        await browser.close()
    return errors, shared, tkoh, amp, editorial, documentary, overflow


def test_phase2_runtime_desktop_behaviors():
    errors, shared, tkoh, amp, editorial, documentary, overflow = asyncio.run(inspect_desktop())
    assert not errors, errors
    assert [item['dialect'] for item in shared] == [
        'build-system', 'follow-signal', 'editorial-composition', 'human-context'
    ]
    for item in shared:
        assert item['handoff'] is True, item
        assert item['handoffActive'] is True, item
        assert item['storyCount'] > 0 and item['storyActive'] == item['storyCount'], item
        assert item['nextDomain'], item

    assert tkoh['frameEdges'] == 4, tkoh
    assert tkoh['buildActive'] is True, tkoh
    assert tkoh['x'] and tkoh['x'] != '0px', tkoh
    assert tkoh['y'] and tkoh['y'] != '0px', tkoh

    assert amp == {'runner': True, 'stepCount': 4, 'focused': 1, 'hasFocus': True}, amp
    assert len(editorial) == 3
    assert any(piece['x'] and piece['x'] != '0px' for piece in editorial), editorial
    assert any(piece['y'] and piece['y'] != '0px' for piece in editorial), editorial
    assert documentary == {'gridFocus': True, 'selected': 1}, documentary
    assert overflow['sw'] == overflow['iw'] == 1440, overflow
