from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
SOUP = BeautifulSoup(HTML, "html.parser")
TKOH = SOUP.select_one("#case-tkoh")


def text(node):
    return " ".join(node.stripped_strings)


def test_tkoh_has_evidence_spine_blocks():
    assert TKOH is not None
    assert TKOH.select_one("[data-tkoh-problem]")
    assert TKOH.select_one("[data-tkoh-responsibility]")
    assert TKOH.select_one("[data-tkoh-criteria]")
    assert TKOH.select_one("[data-tkoh-primary-decision]")
    assert TKOH.select_one("[data-tkoh-system-scale]")
    assert TKOH.select_one("[data-tkoh-current-evidence]")


def test_tkoh_hero_states_role_product_and_active_iteration():
    hero = TKOH.select_one(".exp-hero")
    copy = text(hero)
    assert "Diseño de Producto · UX/UI · estructura visual" in copy
    assert "CRM SaaS · CR Master" in copy
    assert "Iteración activa" in copy
    assert "Figma" not in copy


def test_tkoh_names_three_design_principles():
    criteria = TKOH.select_one("[data-tkoh-criteria]")
    assert criteria is not None
    copy = text(criteria)
    assert "Lo accionable primero" in copy
    assert "Contexto sin saltos innecesarios" in copy
    assert "Patrones que sobreviven al módulo" in copy


def test_tkoh_does_not_claim_unverified_outcomes():
    copy = text(TKOH).lower()
    forbidden = [
        "aumentó la conversión",
        "redujo tiempos",
        "mejoró la productividad",
        "validado con usuarios",
        "resultado probado",
        "diseñé todo el crm",
        "lideré el producto completo",
    ]
    for phrase in forbidden:
        assert phrase not in copy

CSS = (ROOT / "css" / "style.css").read_text(encoding="utf-8")


def test_tkoh_v12_styles_are_scoped_and_responsive():
    assert "#case-tkoh .tkoh-context-grid" in CSS
    assert "#case-tkoh .tkoh-criteria" in CSS
    assert "#case-tkoh .tkoh-scale-grid" in CSS
    assert "@media (max-width: 768px)" in CSS
    assert "@media (max-width: 430px)" in CSS


def test_tkoh_v12_new_labels_have_practical_font_floor():
    expected = [
        "#case-tkoh .tkoh-section-kicker",
        "#case-tkoh .tkoh-responsibility-list span",
        "#case-tkoh .tkoh-criteria-grid span",
        "#case-tkoh .tkoh-scale-copy span",
    ]
    for selector in expected:
        assert selector in CSS

CHOREO_JS = (ROOT / "js" / "case-choreography.js").read_text(encoding="utf-8")


def test_tkoh_v12_reuses_build_system_choreography():
    assert "tkoh-build-frame" in CHOREO_JS
    assert ".tkoh-context-grid" in CHOREO_JS
    assert ".tkoh-criteria" in CHOREO_JS
    assert ".tkoh-scale-card" in CHOREO_JS


def test_tkoh_v12_keeps_evidence_semantic_and_visible():
    selectors = [
        "[data-tkoh-problem]",
        "[data-tkoh-criteria]",
        "[data-tkoh-primary-decision]",
        "[data-tkoh-system-scale]",
        "[data-tkoh-current-evidence]",
    ]
    for selector in selectors:
        node = TKOH.select_one(selector)
        assert node is not None
        assert node.find(["h2", "h3"]) is not None
        assert not node.has_attr("hidden")
        assert node.get("aria-hidden") != "true"

    screenshots = [img for img in TKOH.select("img") if "crmaster-" in img.get("src", "")]
    assert len(screenshots) == 6
    assert all(img.get("alt", "").strip() for img in screenshots)


def test_tkoh_v12_compacts_three_modules_into_one_scale_grid():
    assert TKOH.select_one(".exp-sequence-list") is None
    assert TKOH.select_one(".exp-sequence-images") is None
    cards = TKOH.select(".tkoh-scale-grid .tkoh-scale-card")
    assert len(cards) == 3


def test_tkoh_v12_mobile_scale_grid_has_single_column_contract():
    mobile_start = CSS.index("@media (max-width: 430px)")
    mobile_css = CSS[mobile_start:]
    assert "#case-tkoh .tkoh-scale-grid" in mobile_css
    assert "grid-template-columns: 1fr" in mobile_css


def test_tkoh_v12_new_typography_does_not_drop_below_12px():
    import re

    scoped_rules = re.findall(r"#case-tkoh[^\{]*\{[^\}]*\}", CSS, flags=re.S)
    v12_rules = [rule for rule in scoped_rules if "tkoh-" in rule]
    for rule in v12_rules:
        for size in re.findall(r"font-size:\s*([0-9.]+)px", rule):
            assert float(size) >= 12, rule
