from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
CSS = (ROOT / "css" / "experience-intro.css").read_text(encoding="utf-8")


def _scroll_lock_block() -> str:
    match = re.search(
        r"html\.intro-pending,\s*\nhtml\.intro-running,\s*\nhtml\.intro-pending body,\s*\nhtml\.intro-running body\s*\{(?P<body>[^}]*)\}",
        CSS,
        re.MULTILINE,
    )
    assert match, "Intro scroll-lock selector block is missing"
    return match.group("body")


def test_intro_locks_scroll_while_pending_or_running():
    block = _scroll_lock_block()
    assert "overflow: hidden;" in block
    assert "overscroll-behavior: none;" in block


def test_intro_scroll_lock_keeps_skip_interactive_on_touch():
    assert "touch-action: none" not in CSS


def test_resolved_state_is_not_part_of_scroll_lock_selector():
    block_start = CSS.index("html.intro-pending,\nhtml.intro-running,")
    block_end = CSS.index("}", block_start)
    selector_and_block = CSS[block_start:block_end]
    assert "intro-resolved" not in selector_and_block
