#!/usr/bin/env python3
"""
build-images.py - turns the graphics kit into Apps Script files.

    python3 06-tracker/tools/build-images.py

Apps Script cannot serve files, so every image has to travel inside the page as a data URI.
Pasting the kit in at full size would add roughly a megabyte of base64 to a page that is
otherwise about 60 KB, so each image is first resized to the largest size the interface
actually renders it at (times two, for retina) and then recompressed.

Two outputs, because the kit has two kinds of image in it:

    apps-script/Images.html       the chrome - icons, badges, banners, stamps. Small, needed
                                  on nearly every screen, so it is inlined and sets window.IMG.
    apps-script/DataDiagrams.gs   the twelve concept diagrams. Each is a full slide and by far
                                  the heaviest thing in the kit, and each appears on exactly
                                  one or two of the 63 documents. Inlining all twelve would put
                                  about 800 KB on every single page load to show at most one of
                                  them, so they stay on the server and the browser asks for one
                                  when it needs it - the same bargain the document bodies make.

Needs Pillow:  pip install pillow
"""

import base64
import io
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is not installed. Run: pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "graphics")
OUT = os.path.join(HERE, "..", "apps-script", "Images.html")
OUT_DIAGRAMS = os.path.join(HERE, "..", "apps-script", "DataDiagrams.gs")

# name -> (key used in window.IMG, widest it is ever rendered x2, notes)
#
# The hero is the only opaque image in the kit, so it is the only one that can be a JPEG -
# and being a smooth gradient it compresses to a fraction of its PNG size. Everything else
# carries transparency and stays PNG, quantized to a palette because these are flat-colour
# graphics with very few distinct tones.
PLAN = [
    ("hero-banner.png", "hero", 1600, "jpeg"),
    ("welcome-hero.png", "welcomeHero", 1600, "jpeg"),
    ("welcome-hero-blank.png", "welcomeHeroBlank", 1600, "jpeg"),
    ("welcome-card.png", "welcomeCard", 1440, "jpeg"),
    ("ramp-strip.png", "rampStrip", 1600, "png"),
    ("phase-learn.png", "phaseLearn", 240, "png"),
    ("phase-assist.png", "phaseAssist", 240, "png"),
    ("phase-own.png", "phaseOwn", 240, "png"),
    ("tier-t1.png", "tierT1", 120, "png"),
    ("tier-t2.png", "tierT2", 120, "png"),
    ("tier-t3.png", "tierT3", 120, "png"),
    ("tier-t4.png", "tierT4", 120, "png"),
    ("tier-m.png", "tierM", 120, "png"),
    ("empty-questions.png", "emptyQuestions", 600, "png"),
    ("empty-notes.png", "emptyNotes", 600, "png"),
    ("empty-wrong.png", "emptyWrong", 600, "png"),
    ("empty-inflight.png", "emptyInflight", 600, "png"),
    ("stat-projects.png", "statProjects", 96, "png"),
    ("stat-docs.png", "statDocs", 96, "png"),
    ("stat-questions.png", "statQuestions", 96, "png"),
    ("stat-wrong.png", "statWrong", 96, "png"),
    ("stat-selfassess.png", "statSelfAssess", 96, "png"),

    # Sidebar icons, one per view.
    ("nav-today.png", "navToday", 72, "png"),
    ("nav-library.png", "navLibrary", 72, "png"),
    ("nav-ladder.png", "navLadder", 72, "png"),
    ("nav-questions.png", "navQuestions", 72, "png"),
    ("nav-wrong.png", "navWrong", 72, "png"),
    ("nav-notes.png", "navNotes", 72, "png"),
    ("nav-skills.png", "navSkills", 72, "png"),

    # Status stamps and project badges. Used at full size in the project detail panel, where
    # there is room for them - the compact list rows keep the CSS chips so a row of twelve
    # projects stays a single consistent rhythm.
    ("stamp-done.png", "stampDone", 260, "png"),
    ("stamp-read.png", "stampRead", 260, "png"),
    ("stamp-inprogress.png", "stampInProgress", 300, "png"),
    ("stamp-ready.png", "stampReady", 340, "png"),
    ("stamp-blocked.png", "stampBlocked", 280, "png"),
    ("badge-readonly.png", "badgeReadOnly", 260, "png"),
    ("badge-paired.png", "badgePaired", 330, "png"),
    ("badge-solo.png", "badgeSolo", 200, "png"),
    ("badge-timebox.png", "badgeTimebox", 260, "png"),

    # Library folder headers, one per group.
    ("folder-overview.png", "folderOverview", 700, "jpeg"),
    ("folder-starthere.png", "folderStartHere", 700, "jpeg"),
    ("folder-learning.png", "folderLearning", 700, "jpeg"),
    ("folder-projects.png", "folderProjects", 700, "jpeg"),
    ("folder-mywork.png", "folderMyWork", 700, "jpeg"),
    ("folder-selfassess.png", "folderSelfAssess", 700, "jpeg"),

    # The five recurring meetings.
    ("meeting-meta-monday.png", "meetingMetaMonday", 660, "jpeg"),
    ("meeting-l10.png", "meetingL10", 660, "jpeg"),
    ("meeting-seton-emedco.png", "meetingSetonEmedco", 660, "jpeg"),
    ("meeting-deep-dive.png", "meetingDeepDive", 660, "jpeg"),
    ("meeting-one-on-one.png", "meetingOneOnOne", 660, "jpeg"),

    # Phase-completion medals, shown once the day count crosses each threshold.
    ("milestone-day30.png", "milestoneDay30", 300, "png"),
    ("milestone-day60.png", "milestoneDay60", 300, "png"),
    ("milestone-day90.png", "milestoneDay90", 300, "png"),

    # Account badges. The kit covers two of the five accounts, so these appear only where they
    # match exactly and the rest stay as text.
    ("account-pdc.png", "accountPdc", 560, "jpeg"),
    ("account-seton.png", "accountSeton", 560, "jpeg"),
]

# Concept diagrams, shown above the document that teaches each concept. Fetched one at a time
# rather than inlined - see the note at the top of this file.
#
# WebP rather than JPEG: these are flat colour and large type on a gradient, which is the shape
# WebP is best at, and at matched quality it comes out about a third smaller. Every browser
# released since 2020 reads it. They render at up to 1100 CSS px and hold their text at 1400.
DIAGRAMS = [
    ("diagram-attribution.png", "diagramAttribution", 1400, "webp"),
    ("diagram-keyword-vs-search-term.png", "diagramKeywordSearchTerm", 1400, "webp"),
    ("diagram-guardrail.png", "diagramGuardrail", 1400, "webp"),
    ("diagram-l10.png", "diagramL10", 1400, "webp"),
    ("diagram-project-loop.png", "diagramProjectLoop", 1400, "webp"),
    ("diagram-deliverable.png", "diagramDeliverable", 1400, "webp"),
    ("diagram-archetypes.png", "diagramArchetypes", 1400, "webp"),
    ("diagram-preship.png", "diagramPreship", 1400, "webp"),
    ("diagram-test-modes.png", "diagramTestModes", 1400, "webp"),
    ("diagram-pdc.png", "diagramPdc", 1400, "webp"),
    ("diagram-seton-emedco.png", "diagramSetonEmedco", 1400, "webp"),
    ("diagram-keep-kill.png", "diagramKeepKill", 1400, "webp"),
]

# Optional. Drop the real asset in as graphics/brady-logo.png and re-run - it is picked up
# automatically. Nothing here draws a trademark from memory.
OPTIONAL = [("brady-logo.png", "logo", 520, "png")]


def encode(path, width, fmt):
    im = Image.open(path)
    original = os.path.getsize(path)

    if im.width > width:
        height = round(im.height * width / im.width)
        im = im.resize((width, height), Image.LANCZOS)

    buf = io.BytesIO()
    if fmt == "jpeg":
        im.convert("RGB").save(buf, "JPEG", quality=82, optimize=True, progressive=True)
        mime = "image/jpeg"
    elif fmt == "webp":
        im.convert("RGB").save(buf, "WEBP", quality=80, method=6)
        mime = "image/webp"
    else:
        # FASTOCTREE is the one quantizer that keeps an alpha channel intact.
        im = im.convert("RGBA").quantize(colors=255, method=Image.Quantize.FASTOCTREE)
        im.save(buf, "PNG", optimize=True)
        mime = "image/png"

    data = buf.getvalue()
    return data, mime, original, im.size


def build(plan, optional=()):
    """Encode a list of images and return [(key, data URI)], plus the byte totals."""
    entries = []
    before = after = 0

    for name, key, width, fmt in list(plan) + list(optional):
        path = os.path.join(SRC, name)
        if not os.path.exists(path):
            if (name, key, width, fmt) in optional:
                print("  %-32s not present - skipped (optional)" % name)
                continue
            sys.exit("Missing image: %s" % path)

        data, mime, original, size = encode(path, width, fmt)
        before += original
        after += len(data)
        entries.append((key, "data:%s;base64,%s" % (mime, base64.b64encode(data).decode("ascii"))))

        print(
            "  %-32s %5d KB -> %4d KB   %dx%d"
            % (name, original / 1024, len(data) / 1024, size[0], size[1])
        )

    return entries, before, after


def main():
    print("Chrome, inlined into the page:")
    chrome, chrome_before, chrome_after = build(PLAN, OPTIONAL)

    print("\nConcept diagrams, served one at a time:")
    diagrams, diagram_before, diagram_after = build(DIAGRAMS)

    html = """<!--
  GENERATED FILE - do not edit here.

  Rebuilt from the graphics kit by the image build script kept alongside this project.
  Every image is inlined as a data URI because Apps Script has no way to serve a file.

  The concept diagrams are NOT in here - they are a slide each, and putting all twelve on
  every page load to show at most one of them is a bad trade. They live in DataDiagrams.gs
  and the browser asks for one when a document needs it.
-->
<script>
  window.IMG = {
%s
  };
</script>
""" % ",\n".join('    %s: "%s"' % (key, uri) for key, uri in chrome)

    gs = """/**
 * GENERATED FILE - do not edit here.
 *
 * Rebuilt from the graphics kit by the image build script kept alongside this project.
 *
 * The concept diagrams, one data URI each. They stay on this side rather than in Images.html
 * because each one is a full slide: inlined they would add about %d KB to every page load, to
 * show at most one of them. apiGetDiagram() hands over one when the browser asks, and the
 * browser keeps it for the rest of the session.
 */

/** %d diagrams. */
function DATA_DIAGRAMS() {
  return {
%s
  };
}
""" % (
        diagram_after * 4 / 3 / 1024,
        len(diagrams),
        ",\n".join('    %s: "%s"' % (key, uri) for key, uri in diagrams),
    )

    with open(OUT, "w", encoding="utf-8") as handle:
        handle.write(html)
    with open(OUT_DIAGRAMS, "w", encoding="utf-8") as handle:
        handle.write(gs)

    print(
        "\n%d images inlined. %d KB of source became %d KB (%d KB of base64 on every page load)."
        % (len(chrome), chrome_before / 1024, chrome_after / 1024, os.path.getsize(OUT) / 1024)
    )
    print(
        "%d diagrams held back. %d KB of source became %d KB (%d KB in DataDiagrams.gs, "
        "about %d KB fetched per diagram actually opened)."
        % (
            len(diagrams),
            diagram_before / 1024,
            diagram_after / 1024,
            os.path.getsize(OUT_DIAGRAMS) / 1024,
            diagram_after * 4 / 3 / 1024 / max(len(diagrams), 1),
        )
    )


if __name__ == "__main__":
    main()
