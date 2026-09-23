#!/usr/bin/env python3
"""Regenerate every drawn asset and patch it into the site.

    python3 tools/build.py            # rewrite the assets, report what changed
    python3 tools/build.py --check    # exit 1 if anything is out of date

Each figure is matched in index.html by the class on its <svg>, so the markup
around it — captions, figure wrappers, bilingual attributes — is never touched.
"""
import os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import figures, marks

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CHECK = "--check" in sys.argv


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()


def write(rel, text, changed):
    if read(rel) == text:
        return
    changed.append(rel)
    if not CHECK:
        with open(os.path.join(ROOT, rel), "w", encoding="utf-8") as f:
            f.write(text)


def swap(html, pattern, replacement):
    new, n = re.subn(pattern, lambda _m: replacement, html, count=1, flags=re.S)
    if n != 1:
        raise SystemExit(f"build: expected exactly one match for {pattern!r}, found {n}")
    return new


def main():
    changed = []

    html = read("index.html")
    html = swap(html, r'<svg class="fig" viewBox="0 0 1100 140".*?</svg>', figures.piste())
    html = swap(html, r'<svg class="fig" viewBox="0 0 1100 150".*?</svg>', figures.right_of_way())
    html = swap(html, r'<svg class="fig pool".*?</svg>', figures.pool_sheet())
    html = swap(html, r'(?<=<div class="skychart" aria-hidden="true">)<svg viewBox.*?</svg>',
                figures.sky_chart())
    write("index.html", html, changed)

    chart = figures.sky_chart()
    html404 = read("404.html")
    html404 = swap(html404, r'(?<=<div class="skychart" aria-hidden="true">)<svg viewBox.*?</svg>', chart)
    write("404.html", html404, changed)

    write("assets/img/og.svg", marks.social_card(), changed)

    if CHECK:
        if changed:
            print("out of date: " + ", ".join(changed))
            return 1
        print("up to date")
        return 0
    print("rewrote: " + ", ".join(changed) if changed else "nothing to do")
    print("\nNow regenerate the rasters:  python3 tools/icons.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
