#!/usr/bin/env python3
"""
build-images.py - turns the graphics kit into an Apps Script file.

    python3 06-tracker/tools/build-images.py

Apps Script cannot serve files, so every image has to travel inside the page as a data URI.
Pasting the kit in at full size would add roughly a megabyte of base64 to a page that is
otherwise about 60 KB, so each image is first resized to the largest size the interface
actually renders it at (times two, for retina) and then recompressed.

Writes 06-tracker/apps-script/Images.html, which sets window.IMG.

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

    # Concept diagrams, shown at the top of the document that teaches each concept. These
    # are 2800px slides and by far the heaviest things in the kit, so they are cut harder
    # than the rest - they render around 700px and the text still holds at 1400.
    ("diagram-attribution.png", "diagramAttribution", 1400, "jpeg"),
    ("diagram-keyword-vs-search-term.png", "diagramKeywordSearchTerm", 1400, "jpeg"),
    ("diagram-guardrail.png", "diagramGuardrail", 1400, "jpeg"),
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
    else:
        # FASTOCTREE is the one quantizer that keeps an alpha channel intact.
        im = im.convert("RGBA").quantize(colors=255, method=Image.Quantize.FASTOCTREE)
        im.save(buf, "PNG", optimize=True)
        mime = "image/png"

    data = buf.getvalue()
    return data, mime, original, im.size


def main():
    entries = []
    before = after = 0

    for name, key, width, fmt in PLAN + OPTIONAL:
        path = os.path.join(SRC, name)
        if not os.path.exists(path):
            if (name, key, width, fmt) in OPTIONAL:
                print("  %-22s not present - skipped (optional)" % name)
                continue
            sys.exit("Missing image: %s" % path)

        data, mime, original, size = encode(path, width, fmt)
        before += original
        after += len(data)

        uri = "data:%s;base64,%s" % (mime, base64.b64encode(data).decode("ascii"))
        entries.append((key, uri))

        print(
            "  %-22s %5d KB -> %4d KB   %dx%d"
            % (name, original / 1024, len(data) / 1024, size[0], size[1])
        )

    body = ",\n".join('    %s: "%s"' % (key, uri) for key, uri in entries)

    html = """<!--
  GENERATED FILE - do not edit here.

  Rebuilt from the graphics kit by the image build script kept alongside this project.
  Every image is inlined as a data URI because Apps Script has no way to serve a file.
-->
<script>
  window.IMG = {
%s
  };
</script>
""" % body

    with open(OUT, "w", encoding="utf-8") as handle:
        handle.write(html)

    print(
        "\n%d images. %d KB of source became %d KB encoded (%d KB of base64 on the page)."
        % (len(entries), before / 1024, after / 1024, os.path.getsize(OUT) / 1024)
    )


if __name__ == "__main__":
    main()
