from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "index.html"
HTML = HTML_PATH.read_text(encoding="utf-8")
CSS = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "css").glob("*.css"))
JS = "\n".join(p.read_text(encoding="utf-8") for p in (ROOT / "js").glob("*.js"))

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.id_counts = {}
        self.refs = []
        self.images = []
        self.href_fragments = []
        self.buttons = []
        self.current_button = None

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if data.get("id"):
            self.ids.add(data["id"])
            self.id_counts[data["id"]] = self.id_counts.get(data["id"], 0) + 1
        if tag == "img":
            self.images.append(data)
        for attr in ("src", "href"):
            value = data.get(attr)
            if value:
                self.refs.append((tag, attr, value))
        href = data.get("href", "")
        if href.startswith("#") and len(href) > 1:
            self.href_fragments.append(href[1:])
        if tag == "button":
            self.current_button = {"attrs": data, "text": []}

    def handle_data(self, data):
        if self.current_button is not None:
            self.current_button["text"].append(data)

    def handle_endtag(self, tag):
        if tag == "button" and self.current_button is not None:
            self.buttons.append(self.current_button)
            self.current_button = None

parser = Parser()
parser.feed(HTML)

errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require('data-experience-intro' in HTML, "missing V2.13 intro root")
require('data-intro-skip' in HTML, "missing intro skip control")
require(bool(re.search(r'<button[^>]+data-intro-skip[^>]*>.*?OMITIR', HTML, re.S | re.I)), "intro skip must be a semantic button labeled OMITIR")
require('HAGO' in HTML and 'ENTENDIBLE' in HTML and 'LO COMPLEJO' in HTML, "Hero headline must remain real content")
require('js/experience-intro.js' in HTML, "experience intro module must be loaded")
intro_path = ROOT / 'js' / 'experience-intro.js'
if intro_path.exists():
    intro_js = intro_path.read_text(encoding='utf-8')
    require('data-intro-skip' in intro_js, "intro module must bind skip control")
    require('Escape' in intro_js, "intro module must support Escape")
    require('prefers-reduced-motion' in intro_js, "intro module must support reduced motion")
    require('while (true)' not in intro_js and 'requestAnimationFrame(loop' not in intro_js, "intro must not run a permanent animation loop")
else:
    errors.append('missing js/experience-intro.js')
require('transition: all' not in CSS.lower(), "forbidden transition: all")
require('pin: true' not in JS.lower() and 'pin:true' not in JS.lower(), "forbidden GSAP pin")
require('scrub:' not in JS.lower(), "forbidden GSAP scrub")
require(not ('wheel' in JS.lower() and 'preventdefault' in JS.lower()), "wheel scrolling may be intercepted")
require(not ('touchmove' in JS.lower() and 'preventdefault' in JS.lower()), "touch scrolling may be intercepted")
require('three.js' not in JS.lower() and 'three.module' not in JS.lower(), "Three.js is outside V2.13 Lite scope")


for section_id in ('case-tkoh', 'case-amp', 'case-20prod', 'case-visual'):
    pattern = rf"<section[^>]+id=[\"\']{section_id}[\"\'][\s\S]*?data-story-line"
    require(bool(re.search(pattern, HTML, re.I)), f'missing story line in {section_id}')
require('<canvas' not in HTML.lower(), 'canvas is outside V2.13 Lite scope')
require(HTML.count('<button class="system-node"') == 4, 'Mi Sistema must expose four native button nodes')
require('data-system-projects' in HTML, 'Mi Sistema needs an accessible project-reference region')
TEXT = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', HTML)).strip()
require('YA VISTE CÓMO PIENSO.' in TEXT, 'missing final narrative headline')
require('Ahora cuéntame qué necesitas hacer más claro.' in HTML, 'missing final narrative subheadline')
require('luis.sabrera@studios-tkoh.online' in HTML, 'direct email must remain')
require('CV_Luis_Sabrera_2026.pdf' in HTML, 'CV link must remain')
require('Lima, Perú' in HTML or 'LIMA, PERÚ' in HTML, 'location must remain')
require('transition: all' not in CSS.lower(), 'transition: all is forbidden')
stability = (ROOT / 'css' / 'stability.css').read_text(encoding='utf-8')
require('.amp-journey-intro' in stability and 'position: relative !important' in stability, 'Amazon story intro must not remain sticky')
require('.prod-social-copy' in stability and 'position: relative !important' in stability, '20 Prod story copy must not remain sticky')

for id_value, count in parser.id_counts.items():
    require(count == 1, f'duplicate id: {id_value}')
for image in parser.images:
    require('alt' in image, f'image missing alt: {image.get("src", "unknown")}')
    require(bool(image.get('width')) and bool(image.get('height')), f'image missing intrinsic dimensions: {image.get("src", "unknown")}')
require('floating-preview' not in HTML, 'floating preview must remain removed')

for fragment in sorted(set(parser.href_fragments)):
    require(fragment in parser.ids, f"broken fragment target: #{fragment}")

for tag, attr, value in parser.refs:
    parsed = urlparse(value)
    if value.startswith(('#', 'mailto:', 'tel:', 'javascript:')) or parsed.scheme in {'http', 'https', 'data'}:
        continue
    path_part = unquote(parsed.path)
    if not path_part:
        continue
    local = (ROOT / path_part).resolve()
    try:
        local.relative_to(ROOT.resolve())
    except ValueError:
        errors.append(f"reference escapes project root: {value}")
        continue
    require(local.exists(), f"missing local asset: {value}")

if errors:
    print("V2.13 validator: FAIL")
    for error in errors:
        print(f"- {error}")
    sys.exit(1)

print("V2.13 validator: PASS")
