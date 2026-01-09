from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from pypdf import PdfReader


@dataclass(frozen=True)
class Options:
    keep_page_breaks: bool = False
    max_consecutive_blank_lines: int = 2


_whitespace_re = re.compile(r"[\t\u00A0]+")
_multiple_spaces_re = re.compile(r" {2,}")


def _clean_line(line: str) -> str:
    line = line.rstrip("\n\r")
    line = _whitespace_re.sub(" ", line)
    line = _multiple_spaces_re.sub(" ", line)
    # Normalize common unicode dashes/quotes a bit.
    line = line.replace("\u2013", "—").replace("\u2014", "—")
    line = line.replace("\u2018", "'").replace("\u2019", "'")
    line = line.replace("\u201C", '"').replace("\u201D", '"')
    return line.strip()


def _iter_pages_text(reader: PdfReader) -> Iterable[str]:
    for page in reader.pages:
        yield page.extract_text() or ""


def _collapse_blank_lines(lines: list[str], max_blanks: int) -> list[str]:
    out: list[str] = []
    blanks = 0
    for line in lines:
        if not line:
            blanks += 1
            if blanks <= max_blanks:
                out.append("")
            continue
        blanks = 0
        out.append(line)
    return out


def _looks_like_heading(line: str) -> bool:
    # Heuristics: shortish, title-like, not ending with punctuation, has letters.
    if len(line) < 4:
        return False
    if len(line) > 80:
        return False
    if not re.search(r"[A-Za-z]", line):
        return False
    if line.endswith(":"):
        return True
    if re.match(r"^(\d+\.?\d*\s+).+", line):
        return True
    if line.isupper() and len(line) <= 60:
        return True
    # Title case-ish
    words = line.split()
    if 2 <= len(words) <= 10:
        alpha = [w for w in words if re.search(r"[A-Za-z]", w)]
        if alpha and sum(1 for w in alpha if w[:1].isupper()) / len(alpha) >= 0.7:
            if not re.search(r"[.;!?]$", line):
                return True
    return False


def _as_markdown(lines: list[str]) -> str:
    md: list[str] = []

    # Title block (we'll try to infer from first non-empty lines)
    non_empty = [l for l in lines if l]
    title = non_empty[0] if non_empty else "SNMUI White Paper 2026"

    md.append(f"# {title}")
    md.append("")
    md.append("---")
    md.append("")
    md.append("*Converted from PDF for repo documentation. Formatting is optimized for VS Code Markdown preview.*")
    md.append("")
    md.append("---")
    md.append("")

    # Content pass: convert detected headings and lists.
    for i, line in enumerate(lines):
        if not line:
            md.append("")
            continue

        # Bullet normalization.
        if re.match(r"^[\u2022\-\*]\s+", line):
            md.append("- " + re.sub(r"^[\u2022\-\*]\s+", "", line))
            continue

        # Numbered list normalization.
        m = re.match(r"^(\d+)[\).]\s+(.*)$", line)
        if m:
            md.append(f"{m.group(1)}. {m.group(2)}")
            continue

        # Headings
        if _looks_like_heading(line):
            # Prefer smaller headings when it appears to be numbered.
            if re.match(r"^\d+\.?\d*\s+", line):
                md.append(f"## {line}")
            else:
                md.append(f"## {line}")
            md.append("")
            continue

        md.append(line)

    # Final cleanup: collapse too many blank lines
    md = _collapse_blank_lines([l.rstrip() for l in md], max_blanks=2)

    # Avoid trailing whitespace and trailing blank lines
    while md and md[-1] == "":
        md.pop()

    return "\n".join(md) + "\n"


def convert_pdf_to_markdown(pdf_path: Path, out_path: Path, options: Options) -> None:
    reader = PdfReader(str(pdf_path))

    lines: list[str] = []

    for page_index, page_text in enumerate(_iter_pages_text(reader)):
        raw_lines = page_text.splitlines()
        cleaned = [_clean_line(l) for l in raw_lines]

        # Drop common header/footer noise (simple heuristics)
        cleaned = [l for l in cleaned if l and not re.match(r"^\d+\s*/\s*\d+$", l)]

        # Add page break marker if requested
        if options.keep_page_breaks and page_index > 0:
            lines.append("")
            lines.append("---")
            lines.append("")

        lines.extend(cleaned)
        lines.append("")

    lines = _collapse_blank_lines(lines, max_blanks=options.max_consecutive_blank_lines)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(_as_markdown(lines), encoding="utf-8")


def main() -> None:
    pdf = Path(__file__).resolve().parents[1] / "SNMUI White Paper 2026.pdf"
    out = Path(__file__).resolve().parents[1] / "SNMUI White Paper 2026.md"

    convert_pdf_to_markdown(pdf, out, Options(keep_page_breaks=False))
    print(f"Wrote: {out}")


if __name__ == "__main__":
    main()
