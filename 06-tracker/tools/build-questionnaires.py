#!/usr/bin/env python3
"""
build-questionnaires.py - turns the two fill-in-yourself Markdown files into one workbook.

    python3 06-tracker/tools/build-questionnaires.py

Two files in this repo ask questions and give you nowhere to write the answer:

    05-self-assessment/baseline.md      the 31-skill Day-1 baseline
    01-start-here/about-how-you-work.md the intake - how you learn, how you like to work

Both are Markdown tables with empty cells, which is fine to read and miserable to fill in.
This writes the same questions into a spreadsheet you can type into:

    05-self-assessment/first-day-questionnaires.xlsx

The Markdown files stay the source of truth. If a question changes there, change it here
and regenerate - the same bargain as 06-tracker/sheets-practice/generate.mjs, and the same
failure if you only do one of the two.

The score wording ("Not yet" / "Developing" / "Independent") is deliberately the same as
the Apps Script tracker's Score list in apps-script/Schema.gs, so the two agree.

Needs openpyxl:  pip install openpyxl
"""

import json
import os

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.comments import Comment

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, '05-self-assessment', 'first-day-questionnaires.xlsx')

# Brady Blue, per CLAUDE.md. The tracker uses the same hex for this sheet.
BRADY_BLUE = '002D72'
TINT = 'E8EFF8'
RULE = 'C7D2E4'
INPUT_FILL = 'FFFDF0'          # cells you type in
GREY = '5A6472'

FONT = 'Arial'

SCORES = ['Not yet', 'Developing', 'Independent']
TOUCHED = ['Never', 'Poked at it', 'Used it properly']
YESNO = ['Yes', 'No']

thin = Side(style='thin', color=RULE)
BOX = Border(left=thin, right=thin, top=thin, bottom=thin)


def h1(ws, cell, text, span):
    """A Brady-blue banner across `span` columns."""
    ws[cell] = text
    ws[cell].font = Font(name=FONT, size=13, bold=True, color='FFFFFF')
    ws[cell].fill = PatternFill('solid', fgColor=BRADY_BLUE)
    ws[cell].alignment = Alignment(vertical='center', horizontal='left', indent=1)
    row = ws[cell].row
    col = ws[cell].column
    ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col + span - 1)
    ws.row_dimensions[row].height = 26


def header_row(ws, row, labels, start=1):
    for i, label in enumerate(labels):
        c = ws.cell(row=row, column=start + i, value=label)
        c.font = Font(name=FONT, size=10, bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor=BRADY_BLUE)
        c.alignment = Alignment(vertical='center', horizontal='left', indent=1, wrap_text=True)
        c.border = BOX
    ws.row_dimensions[row].height = 22


def section_row(ws, row, text, span):
    """A section band across columns B..span.

    Column A is left empty on purpose. It holds the row's ref - A1, Q7 - on question rows
    and nothing else, which is what lets the "answered N of M" formulas count questions with
    a plain COUNTA. Put the section title in A and every band gets counted as a question.
    """
    for i in range(1, span + 1):
        ws.cell(row=row, column=i).fill = PatternFill('solid', fgColor=TINT)
        ws.cell(row=row, column=i).border = BOX
    c = ws.cell(row=row, column=2, value=text)
    c.font = Font(name=FONT, size=11, bold=True, color=BRADY_BLUE)
    c.alignment = Alignment(vertical='center', horizontal='left', indent=1)
    ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=span)
    ws.row_dimensions[row].height = 22


def body(ws, row, col, text, wrap=True, italic=False, size=10, color='000000'):
    c = ws.cell(row=row, column=col, value=text)
    c.font = Font(name=FONT, size=size, italic=italic, color=color)
    c.alignment = Alignment(vertical='top', horizontal='left', wrap_text=wrap, indent=1)
    c.border = BOX
    return c


def input_cell(ws, row, col, wrap=True):
    c = ws.cell(row=row, column=col)
    c.fill = PatternFill('solid', fgColor=INPUT_FILL)
    c.font = Font(name=FONT, size=10)
    c.alignment = Alignment(vertical='top', horizontal='left', wrap_text=wrap, indent=1)
    c.border = BOX
    return c


def note(ws, row, col, text, span=1):
    c = ws.cell(row=row, column=col, value=text)
    c.font = Font(name=FONT, size=9, italic=True, color=GREY)
    c.alignment = Alignment(vertical='top', horizontal='left', wrap_text=True, indent=1)
    if span > 1:
        ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col + span - 1)
    return c


# --------------------------------------------------------------------------------------
# The questions. Wording is copied from the Markdown - change it there first.
# --------------------------------------------------------------------------------------

# 05-self-assessment/baseline.md
SKILLS = [
    ('A', 'Foundational paid-search skills', [
        "Read a Google Ads account and explain what it's doing",
        'Explain the difference between a keyword and a search term',
        'Explain match types and when each one is right',
        'Identify campaign types (Search / Shopping / PMax / DemandGen / DSA)',
        'Explain manual vs. smart bidding, and what tROAS/tCPA actually do',
        'Explain what a product feed is and what breaks when one breaks',
    ]),
    ('B', 'How Brady measures things', [
        "Explain which attribution model Brady's reported numbers use",
        'Explain why platform "Conversions" differ from reported revenue',
        'Say whether a given number is inside its guardrail',
        "Know when a number can't be trusted, and why",
        'Describe what changed and why, framed per business day',
    ]),
    ('C', 'The accounts', [
        'PDC Healthcare: structure, feed, audience',
        'PDC Wristbands: the Shopify stack and why its ROAS looks the way it does',
        'Seton / EMEDCO: what they sell and how they differ from each other',
        'Mecco: what it is and what state it is in',
        'Explain how a conversion action is configured and why it matters',
    ]),
    ('D', 'Operating rhythm', [
        'Run a daily search-terms review and make Keep/Kill calls',
        "Check budget pacing and spot when something's off",
        'Bring an agenda and numbers to a 1:1',
        'Contribute to the weekly team huddle',
        'Pull the numbers for a monthly review and write the story behind them',
    ]),
    ('E', 'Judgment', [
        "Make a change to a live account safely, and know what's reversible",
        'Bring a recommendation rather than an open question',
        'Argue for increasing spend when the numbers support it',
        "Know what's mine to decide and what to escalate",
    ]),
    ('F', 'Tools', [
        'Google Ads',
        'Google Sheets (beyond the basics)',
        'Power BI',
        'Adobe Analytics',
        'BigQuery / SQL',
        'Using AI tools for real work, not just questions',
    ]),
]

SKILL_IDS = ['{0}{1}'.format(letter, i)
             for letter, _title, skills in SKILLS
             for i in range(1, len(skills) + 1)]

BASELINE_WRITTEN = [
    ('Day 1 - what are you most worried about?',
     'Write it here, and then read it again at Day 90.'),
    ('Day 90 - what turned out to be harder than you expected, and what turned out to be easier?',
     'Leave this blank on day one. It is the Day-90 half of the pair.'),
]

# 01-start-here/about-how-you-work.md, via intake/questions.json - the one list the app's
# How I work screen is built from too (tools/build-intake.mjs), so the two cannot drift.
# Rows come back in the shape the sheet builder below expects:
#   ('pick', question, [options])  |  ('rank', question, None)  |  ('text', question, hint)
#   ('note', text, None)
def load_intake():
    with open(os.path.join(REPO, '06-tracker', 'intake', 'questions.json'), encoding='utf-8') as fh:
        data = json.load(fh)
    out = []
    for sec in data['sections']:
        rows = []
        for q in sec['questions']:
            if q['type'] == 'note':
                rows.append(('note', q['text'], None))
            elif q['type'] == 'pick':
                rows.append(('pick', q['text'], list(q['options'])))
            elif q['type'] == 'rank':
                rows.append(('rank', q['text'], None))
            else:
                rows.append(('text', q['text'], q.get('hint', '')))
        out.append(('{0} - {1}'.format(sec['id'], sec['title']), rows))
    return out


INTAKE = load_intake()

LEVERS = [
    ("Reading isn't how you learn",
     'More pairing and shadowing, files demoted to lookup. The biggest single change available'),
    ("You've never used SQL",
     'BigQuery access requested in week one - the longest lead time of anything you will be given'),
    ("Big spreadsheets aren't second nature",
     'A session on it before Tier 1, rather than mid-project'),
    ('You grind rather than ask',
     'Alex checks in proactively instead of waiting for a raised hand'),
    ('Asking in a public channel feels expensive',
     'You start in DMs and move to the channel when you want to. Your daily three lines can go '
     'to Alex directly instead of the team channel'),
    ('You want feedback written down',
     'Project debriefs come back as notes, not just as conversation'),
    ('Being wrong in front of people is uncomfortable',
     'Predict-then-compare stays, because it is how the learning works - but the early rounds '
     'are solo, and Alex goes first on the paired ones'),
    ('Deadlines help you',
     'Briefs come with dates. If they do not help, they come with an order instead'),
    ("You'd rather listen in meetings first",
     'You get a heads-up before you are asked anything, and the Deep Dive handover is rehearsed '
     'rather than cold'),
    ('Mornings are your good hours',
     'Heavy reading moves to mornings and paired work to afternoons - or the reverse'),
    ("You've worked in SEO",
     'Meta Monday becomes a contribution meeting for you much sooner'),
    ("You've barely used AI tools",
     'The AI thread starts at the beginning and moves at its own pace'),
    ("There's something you want that isn't in the plan",
     'We look for where it fits. Some of it will fit inside the 90 days, some belongs in '
     '03-projects/after-the-ramp.md'),
]


# --------------------------------------------------------------------------------------
# Sheets
# --------------------------------------------------------------------------------------

def build_lists(wb):
    """Option lists live on their own hidden sheet.

    Inline data validation lists ("a,b,c") break the moment an option contains a comma, and
    several of these do. A range reference does not have that problem.
    """
    ws = wb.create_sheet('Lists')
    lists = {}

    def put(col, header, values):
        letter = get_column_letter(col)
        ws.cell(row=1, column=col, value=header)
        for i, v in enumerate(values):
            ws.cell(row=2 + i, column=col, value=v)
        lists[header] = 'Lists!${0}$2:${0}${1}'.format(letter, 1 + len(values))

    col = 1
    put(col, 'Score', SCORES); col += 1
    put(col, 'Touched', TOUCHED); col += 1
    put(col, 'YesNo', YESNO); col += 1

    for section, rows in INTAKE:
        for kind, question, options in rows:
            if kind == 'pick' and options not in (TOUCHED, YESNO):
                put(col, question[:31], options)
                lists[question] = lists.pop(question[:31])
                col += 1

    ws.sheet_state = 'hidden'
    return lists


def build_baseline(wb):
    ws = wb.create_sheet('Day 1 baseline')
    widths = [8, 62, 14, 14, 14, 46]
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

    h1(ws, 'A1', 'Your Day-1 baseline - 31 skills', len(widths))
    note(ws, 2, 1, 'Fill in the Day 1 column in your first few days, BEFORE any training - that '
                   'is the whole point of a baseline. Re-score at Day 30 and Day 90 and put them '
                   'side by side. Source: 05-self-assessment/baseline.md', span=len(widths))
    ws.row_dimensions[2].height = 28
    note(ws, 3, 1, 'Not yet = I could not do this or explain it.   Developing = I could have a go, '
                   'with help or with checking.   Independent = I could do this on my own and be '
                   'confident I was right.', span=len(widths))
    ws.row_dimensions[3].height = 26
    note(ws, 4, 1, 'This is yours. It is not a test, it is not scored by anyone else, and it does '
                   'not go into any review. Expect some scores to go DOWN at Day 30 - that means '
                   'the training is working.', span=len(widths))
    ws.row_dimensions[4].height = 26

    header_row(ws, 6, ['ID', 'Skill', 'Day 1', 'Day 30', 'Day 90', 'Evidence / notes (optional)'])
    ws.freeze_panes = 'A7'

    dv = DataValidation(type='list', formula1='Lists!$A$2:$A$4', allow_blank=True,
                        showDropDown=False)
    dv.prompt = 'Pick one: Not yet, Developing, or Independent'
    dv.promptTitle = 'How confident are you today?'
    ws.add_data_validation(dv)

    row = 7
    first_row = None
    for letter, title, skills in SKILLS:
        section_row(ws, row, '{0} - {1}'.format(letter, title), len(widths))
        row += 1
        for n, skill in enumerate(skills, start=1):
            if first_row is None:
                first_row = row
            body(ws, row, 1, '{0}{1}'.format(letter, n), wrap=False, size=9, color=GREY)
            ws.cell(row=row, column=1).alignment = Alignment(vertical='top', horizontal='center')
            body(ws, row, 2, skill)
            for col in (3, 4, 5):
                c = input_cell(ws, row, col, wrap=False)
                c.alignment = Alignment(vertical='center', horizontal='center')
                dv.add(c)
            input_cell(ws, row, 6)
            ws.row_dimensions[row].height = 30
            row += 1
    last_row = row - 1

    # Colour the score cells once they are filled in - the 🔴/🟡/🟢 of the Markdown, without
    # relying on an emoji rendering the same way in Excel.
    band = 'C{0}:E{1}'.format(first_row, last_row)
    for value, fill_hex, text_hex in (
        ('Not yet', 'FDE7E4', 'B22A14'),
        ('Developing', 'FFF1E0', 'A34600'),
        ('Independent', 'E6F6EC', '10662F'),
    ):
        ws.conditional_formatting.add(band, FormulaRule(
            formula=['EXACT(C{0},"{1}")'.format(first_row, value)],
            fill=PatternFill('solid', fgColor=fill_hex),
            font=Font(name=FONT, size=10, bold=True, color=text_hex),
            stopIfTrue=False))

    row += 1
    note(ws, row, 1, '{0} skills, rows {1} to {2}. Score every one you have a view on and '
                     'leave the rest - a blank is not a gap you have to go back and '
                     'close.'.format(len(SKILL_IDS), first_row, last_row), span=len(widths))
    row += 1

    row += 1
    h1(ws, 'A{0}'.format(row), 'Two questions to answer in your own words', len(widths))
    row += 1
    for question, hint in BASELINE_WRITTEN:
        body(ws, row, 1, question)
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=len(widths))
        ws.cell(row=row, column=1).font = Font(name=FONT, size=10, bold=True)
        row += 1
        note(ws, row, 1, hint, span=len(widths))
        row += 1
        c = input_cell(ws, row, 1)
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=len(widths))
        for i in range(1, len(widths) + 1):
            ws.cell(row=row, column=i).fill = PatternFill('solid', fgColor=INPUT_FILL)
            ws.cell(row=row, column=i).border = BOX
        ws.row_dimensions[row].height = 76
        row += 2

    ws.cell(row=first_row, column=3).comment = Comment(
        'Rate yourself honestly low. A page of "Not yet" on day one is exactly right - it is a '
        'map, not a judgment. Inflating it now only steals from the Day-90 comparison, and the '
        'comparison is for you.', 'Onboarding')
    return first_row, last_row


def build_intake(wb, lists):
    ws = wb.create_sheet('How I work')
    widths = [7, 56, 34, 44]
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

    h1(ws, 'A1', 'About how you work - the intake', len(widths))
    note(ws, 2, 1, 'About twenty minutes. Blank is a real answer - it means "no strong feeling", '
                   'and that is useful too. If you only have ten minutes, do sections 1, 2 and 3: '
                   'those are the three that change the most. '
                   'Source: 01-start-here/about-how-you-work.md', span=len(widths))
    ws.row_dimensions[2].height = 28
    note(ws, 3, 1, 'This is not a test and it is not stored anywhere formal. Honest answers make '
                   'the next twelve weeks better; flattering ones make them worse. Every question '
                   'here pulls a real lever - see the "What this changes" tab.', span=len(widths))
    ws.row_dimensions[3].height = 28

    header_row(ws, 5, ['Ref', 'Question', 'Your answer', 'Why we are asking'])
    ws.freeze_panes = 'A6'

    dv_cache = {}

    def validator(key, formula, prompt):
        if key not in dv_cache:
            d = DataValidation(type='list', formula1=formula, allow_blank=True,
                               showDropDown=False)
            d.prompt = prompt
            d.promptTitle = 'Pick one'
            ws.add_data_validation(d)
            dv_cache[key] = d
        return dv_cache[key]

    dv_rank = DataValidation(type='whole', operator='between', formula1=1, formula2=4,
                             allow_blank=True)
    dv_rank.prompt = '1 is what works best for you, 4 is what works least well.'
    dv_rank.promptTitle = 'Rank 1-4'
    dv_rank.error = 'Use a whole number from 1 to 4.'
    ws.add_data_validation(dv_rank)

    row = 6
    n = 0
    first_row = None
    for section, rows in INTAKE:
        section_row(ws, row, section, len(widths))
        row += 1
        for kind, question, options in rows:
            if kind == 'note':
                note(ws, row, 2, question, span=3)
                ws.row_dimensions[row].height = 30
                row += 1
                continue

            n += 1
            if first_row is None:
                first_row = row
            body(ws, row, 1, 'Q{0}'.format(n), wrap=False, size=9, color=GREY)
            ws.cell(row=row, column=1).alignment = Alignment(vertical='top', horizontal='center')
            body(ws, row, 2, question)
            c = input_cell(ws, row, 3, wrap=(kind == 'text'))

            if kind == 'pick':
                # Value equality, not identity - build_lists() decides which questions get
                # their own column the same way, and the two must agree or the lookup
                # below raises on a question whose options merely equal a shared list.
                key = 'Touched' if options == TOUCHED else ('YesNo' if options == YESNO else question)
                validator(key, lists[key], 'Pick one of: ' + '; '.join(options)).add(c)
                body(ws, row, 4, '; '.join(options), size=9, italic=True, color=GREY)
                ws.row_dimensions[row].height = 32
            elif kind == 'rank':
                dv_rank.add(c)
                c.alignment = Alignment(vertical='center', horizontal='center')
                body(ws, row, 4, '1 = works best, 4 = works least well', size=9,
                     italic=True, color=GREY)
                ws.row_dimensions[row].height = 22
            else:
                body(ws, row, 4, options or 'A sentence is plenty. Nobody is reading this for style.',
                     size=9, italic=True, color=GREY)
                ws.row_dimensions[row].height = 56
            row += 1
    last_row = row - 1

    row += 1
    note(ws, row, 2, '{0} questions, Q1 to Q{0}. Sections 1, 2 and 3 are the three that change '
                     'the most - do those first if you are short of time.'.format(n), span=3)
    return first_row, last_row, n


def intake_ref(needle):
    """The Q-number of an intake question, looked up rather than hardcoded.

    The example table on "Start here" cites three real questions by ref. Typing those numbers
    in by hand goes stale the moment a question is added, and a wrong ref in the one place
    that explains how to fill the thing in is worse than no example.
    """
    n = 0
    for _section, rows in INTAKE:
        for kind, question, _options in rows:
            if kind == 'note':
                continue
            n += 1
            if needle in question:
                return 'Q{0}'.format(n)
    raise KeyError(needle)


def build_levers(wb):
    ws = wb.create_sheet('What this changes')
    widths = [46, 78]
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

    h1(ws, 'A1', 'What your answers actually change', len(widths))
    note(ws, 2, 1, 'Every row here is a real lever, and pulling it costs nothing in week one and '
                   'quite a lot in week six. That is the entire reason for the "How I work" tab. '
                   'Read it if you want to know why any of those questions are being asked. '
                   'Anything you disagree with here is worth saying too.', span=len(widths))
    ws.row_dimensions[2].height = 42

    header_row(ws, 4, ['If you say', 'What we change'])
    ws.freeze_panes = 'A5'
    row = 5
    for says, changes in LEVERS:
        body(ws, row, 1, says)
        body(ws, row, 2, changes)
        ws.row_dimensions[row].height = 32
        row += 1

    row += 1
    note(ws, row, 1, 'Source: the table at the end of 01-start-here/about-how-you-work.md. '
                     'Nothing on this tab needs filling in.', span=len(widths))


def build_start_here(wb, baseline_rows, intake_rows, intake_count):
    ws = wb.create_sheet('Start here')
    widths = [26, 58, 46]
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

    h1(ws, 'A1', 'First-day questionnaires - somewhere to actually write the answers', len(widths))
    note(ws, 2, 1, 'Two things in this repo ask you questions and give you nowhere to put the '
                   'answers. This is that place. Neither is a test, neither is scored, and '
                   'neither goes into any review.', span=len(widths))
    ws.row_dimensions[2].height = 28

    header_row(ws, 4, ['Tab', 'What it is', 'When'])
    rows = [
        ('Day 1 baseline', '31 skills, rated Not yet / Developing / Independent, plus two '
                           'written questions. Shows how far you moved, not how good you are',
         'Day 1, before any training. Again at Day 30 and Day 90'),
        ('How I work', 'The intake - how you learn, how you like to be asked and told things, '
                       'what you have already touched',
         'First couple of days. Bring it to your first conversation with Alex'),
        ('What this changes', 'Reference. The lever each intake answer pulls',
         'Read it whenever you want to know why a question is being asked'),
    ]
    row = 5
    for tab, what, when in rows:
        body(ws, row, 1, tab, wrap=False).font = Font(name=FONT, size=10, bold=True,
                                                      color=BRADY_BLUE)
        body(ws, row, 2, what)
        body(ws, row, 3, when)
        ws.row_dimensions[row].height = 42
        row += 1

    row += 1
    h1(ws, 'A{0}'.format(row), 'How to fill it in', len(widths))
    row += 1
    legend = [
        ('The cream cells are yours', 'Every cell with a pale cream background is one you type '
                                      'in. Nothing else needs touching'),
        ('Most answers are a dropdown', 'Click the cell and pick from the list. You can also '
                                        'type the wording exactly'),
        ('Four rows are a ranking', 'Section 2 of "How I work" takes a number 1-4, where 1 is '
                                    'what works best for you'),
        ('Written answers are free text', 'A sentence is plenty. Alt+Enter starts a new line '
                                          'inside a cell'),
        ('Blank is a real answer', 'It means "no strong feeling". Leaving something out is not '
                                   'a gap you have to go back and close'),
    ]
    for label, text in legend:
        body(ws, row, 1, label, wrap=False).font = Font(name=FONT, size=10, bold=True)
        body(ws, row, 2, text)
        ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=3)
        ws.cell(row=row, column=3).border = BOX
        ws.row_dimensions[row].height = 30
        row += 1

    row += 1
    h1(ws, 'A{0}'.format(row), 'What a filled-in row looks like', len(widths))
    row += 1
    note(ws, row, 1, 'An example, not your answers - it lives here so nothing has to be deleted '
                     'off the real tabs.', span=len(widths))
    row += 1
    header_row(ws, row, ['Where', 'The question', 'What you would type'])
    row += 1
    sql_q = intake_ref('SQL, or any query language')
    read_q = intake_ref('Reading it and working it out')
    load_q = intake_ref('If you had too much on')
    examples = [
        ('Day 1 baseline, C column', 'Explain match types and when each one is right', 'Not yet'),
        ('Day 1 baseline, F column', 'Evidence / notes (optional)',
         'Guessed at broad vs phrase in T1-3 and got it backwards'),
        ('How I work, ' + sql_q, 'SQL, or any query language', 'Poked at it'),
        ('How I work, ' + read_q, 'Reading it and working it out (rank 1-4)', '2'),
        ('How I work, ' + load_q, 'If you had too much on, how would we know?',
         'I go quiet and stop asking questions. Ask me directly'),
    ]
    for where, question, answer in examples:
        body(ws, row, 1, where, size=9, color=GREY)
        body(ws, row, 2, question)
        c = body(ws, row, 3, answer)
        c.fill = PatternFill('solid', fgColor=INPUT_FILL)
        ws.row_dimensions[row].height = 28
        row += 1

    row += 1
    h1(ws, 'A{0}'.format(row), "What's on each tab", len(widths))
    row += 1
    b_first, b_last = baseline_rows
    i_first, i_last = intake_rows
    for label, where in (
        ('Day 1 baseline', '{0} skills on rows {1}-{2}, three score columns (Day 1, Day 30, '
                           'Day 90), then two written questions below them'.format(
                               len(SKILL_IDS), b_first, b_last)),
        ('How I work', 'Q1 to Q{0} on rows {1}-{2}, in nine sections'.format(
            intake_count, i_first, i_last)),
    ):
        body(ws, row, 1, label, wrap=False).font = Font(name=FONT, size=10, bold=True,
                                                        color=BRADY_BLUE)
        body(ws, row, 2, where)
        ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=3)
        ws.cell(row=row, column=3).border = BOX
        ws.row_dimensions[row].height = 30
        row += 1

    row += 2
    for line in [
        'Where the questions came from: 05-self-assessment/baseline.md (the 31 skills) and '
        '01-start-here/about-how-you-work.md (the intake). Those Markdown files stay the source '
        'of truth - this workbook is the place to answer them.',
        'One thing this workbook adds: a Day 30 column on the baseline. baseline.md prints only '
        'Day 1 and Day 90, but its own guidance talks about Day-30 scores and the Apps Script '
        'tracker already carries all three. Leave it blank if you would rather not use it.',
        'When it is filled in: keep it. It is yours. If you want it in the repo, '
        '04-my-work/ is where your own work goes - upload it there through the GitHub website, '
        'no git needed.',
        'Regenerate this file with: python3 06-tracker/tools/build-questionnaires.py - which '
        'overwrites it, answers and all. Save your filled-in copy under a different name first.',
    ]:
        note(ws, row, 1, line, span=len(widths))
        ws.row_dimensions[row].height = 30
        row += 1


def main():
    wb = Workbook()
    wb.remove(wb.active)

    lists = build_lists(wb)
    b_first, b_last = build_baseline(wb)
    i_first, i_last, i_count = build_intake(wb, lists)
    build_levers(wb)
    build_start_here(wb, (b_first, b_last), (i_first, i_last), i_count)

    wb._sheets = [wb['Start here'], wb['Day 1 baseline'], wb['How I work'],
                  wb['What this changes'], wb['Lists']]
    wb.active = 0

    for ws in wb.worksheets:
        ws.sheet_view.showGridLines = False

    wb.save(OUT)
    print('wrote {0}'.format(os.path.relpath(OUT, REPO)))
    print('  {0} skills on the baseline, {1} questions on the intake'.format(
        sum(len(s[2]) for s in SKILLS), i_count))


if __name__ == '__main__':
    main()
