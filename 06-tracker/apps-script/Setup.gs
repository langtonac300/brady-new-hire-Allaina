/**
 * Setup.gs - builds the workbook.
 *
 * `setupWorkbook()` is safe to run more than once. It creates whatever is missing, brings
 * formatting and dropdowns back in line with Schema.gs, and seeds only the tables that are
 * still empty. It will not overwrite anything already filled in.
 *
 * `reimportContent()` is the one to run after the source material changes. It refreshes the
 * document text while keeping every Status, Read on and My notes value already recorded.
 */

/** Sheet name quoted for use in a formula. Several of ours contain spaces or hyphens. */
function q(name) {
  return "'" + String(name).replace(/'/g, "''") + "'";
}

/** 1 -> A, 27 -> AA. */
function columnLetter(index) {
  var out = '';
  var n = index;
  while (n > 0) {
    var rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = (n - rem - 1) / 26;
  }
  return out;
}

/**
 * A whole-column reference worked out from Schema.gs rather than typed as a letter.
 *
 * This matters: the dashboard is the one place that has to name columns positionally, and
 * hardcoding "M:M" means inserting a column anywhere to its left silently produces a wrong
 * number rather than an error. Deriving it means "Repair workbook" fixes the dashboard too.
 */
function colRef(tableName, columnName, fromRow2) {
  var def = tableDef(tableName);
  for (var i = 0; i < def.columns.length; i++) {
    if (def.columns[i].name === columnName) {
      var letter = columnLetter(i + 1);
      return fromRow2
        ? q(tableName) + '!' + letter + '2:' + letter
        : q(tableName) + '!' + letter + ':' + letter;
    }
  }
  throw new Error('No column "' + columnName + '" on ' + tableName + '. Check Schema.gs.');
}

function setupWorkbook() {
  var book = ss();
  buildListsSheet();

  SCHEMA().forEach(function (def) {
    ensureSheet(def);
  });

  seedIfEmpty();
  buildDashboard();

  // Put the sheets in reading order and drop the empty default sheet Google creates.
  // A hidden sheet cannot be made active, so Lists is briefly shown while it is moved.
  var order = [T.DASHBOARD, T.DOCS, T.PROJECTS, T.QUESTIONS, T.WRONG, T.NOTES, T.SKILLS, T.SETTINGS, T.LISTS];
  order.forEach(function (name, i) {
    var sheet = book.getSheetByName(name);
    if (!sheet) return;
    var wasHidden = sheet.isSheetHidden();
    if (wasHidden) sheet.showSheet();
    book.setActiveSheet(sheet);
    book.moveActiveSheet(i + 1);
    if (wasHidden) sheet.hideSheet();
  });

  var stray = book.getSheetByName('Sheet1');
  if (stray && stray.getLastRow() === 0 && book.getSheets().length > 1) book.deleteSheet(stray);

  book.setActiveSheet(book.getSheetByName(T.DASHBOARD));
  return 'Workbook ready. ' + dbSelect(T.DOCS).length + ' documents, ' +
    dbSelect(T.PROJECTS).length + ' projects, ' + dbSelect(T.SKILLS).length + ' skills.';
}

/** Create or refresh one sheet from its definition. Data below row 1 is never touched. */
function ensureSheet(def) {
  var book = ss();
  var sheet = book.getSheetByName(def.name) || book.insertSheet(def.name);

  var headers = def.columns.map(function (c) {
    return c.name;
  });

  // Widen first if the schema has grown, so writing headers cannot fall off the edge.
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  // Every range below is written relative to row 2, so there has to be a row 2.
  if (sheet.getMaxRows() < 50) sheet.insertRowsAfter(sheet.getMaxRows(), 50 - sheet.getMaxRows());

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setFontFamily('Montserrat')
    .setFontColor('#FFFFFF')
    .setBackground(def.colour || '#002D72')
    .setVerticalAlignment('middle')
    .setWrap(true);

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);
  if (sheet.getFrozenColumns() < 1) sheet.setFrozenColumns(1);

  def.columns.forEach(function (col, i) {
    sheet.setColumnWidth(i + 1, col.w || 140);
    var body = sheet.getRange(2, i + 1, Math.max(sheet.getMaxRows() - 1, 1), 1);
    body.setFontFamily('Montserrat').setFontSize(10).setVerticalAlignment('top');
    body.setWrap(!!col.wrap);
    if (col.type === 'date') body.setNumberFormat(col.name === 'Updated' ? 'yyyy-mm-dd hh:mm' : 'yyyy-mm-dd');
    if (col.type === 'number') body.setNumberFormat('0.##');
  });

  applyValidation(sheet, def);
  applyBanding(sheet, def);
  applyConditionalFormats(sheet, def);

  if (def.hidden) sheet.hideSheet();
  return sheet;
}

/** Dropdowns point at the Lists sheet by range, so editing an option there updates every
 *  dropdown at once without a code change. */
function applyValidation(sheet, def) {
  var lists = ss().getSheetByName(T.LISTS);
  var names = Object.keys(LISTS());

  def.columns.forEach(function (col, i) {
    var range = sheet.getRange(2, i + 1, Math.max(sheet.getMaxRows() - 1, 1), 1);
    if (!col.list) {
      range.clearDataValidations();
      return;
    }
    var listIndex = names.indexOf(col.list);
    if (listIndex === -1) return;
    var options = LISTS()[col.list];
    var source = lists.getRange(2, listIndex + 1, options.length, 1);
    range.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInRange(source, true)
        .setAllowInvalid(false)
        .setHelpText('Pick one of: ' + options.join(', '))
        .build()
    );
  });
}

function applyBanding(sheet, def) {
  sheet.getBandings().forEach(function (b) {
    b.remove();
  });
  var rows = Math.max(sheet.getMaxRows() - 1, 1);
  sheet
    .getRange(2, 1, rows, def.columns.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
}

/**
 * Colour the status columns. Every rule pairs colour with the word itself, never colour
 * alone - the text in the cell is what carries the meaning.
 */
function applyConditionalFormats(sheet, def) {
  var rules = [];
  var rows = Math.max(sheet.getMaxRows() - 1, 1);

  var palette = {
    Done: ['#0B6E4F', '#E4F2EC'],
    'Ready for readout': ['#7A5C00', '#FBF3D5'],
    'In progress': ['#002D72', '#DCE6F5'],
    Blocked: ['#8C1D18', '#FBE9E7'],
    'Not started': ['#5F6368', '#F1F3F4'],
    Read: ['#0B6E4F', '#E4F2EC'],
    Reading: ['#002D72', '#DCE6F5'],
    Reference: ['#5F6368', '#F1F3F4'],
    Open: ['#8C1D18', '#FBE9E7'],
    Answered: ['#0B6E4F', '#E4F2EC'],
    Parked: ['#5F6368', '#F1F3F4'],
    'Not yet': ['#8C1D18', '#FBE9E7'],
    Developing: ['#7A5C00', '#FBF3D5'],
    Independent: ['#0B6E4F', '#E4F2EC']
  };

  def.columns.forEach(function (col, i) {
    if (!col.list) return;
    var range = sheet.getRange(2, i + 1, rows, 1);
    LISTS()[col.list].forEach(function (option) {
      var colours = palette[option];
      if (!colours) return;
      rules.push(
        SpreadsheetApp.newConditionalFormatRule()
          .whenTextEqualTo(option)
          .setFontColor(colours[0])
          .setBackground(colours[1])
          .setRanges([range])
          .build()
      );
    });
  });

  sheet.setConditionalFormatRules(rules);
}

/** The Lists sheet: one column per dropdown, header in row 1. */
function buildListsSheet() {
  var book = ss();
  var sheet = book.getSheetByName(T.LISTS) || book.insertSheet(T.LISTS);
  sheet.clear();

  var lists = LISTS();
  var names = Object.keys(lists);
  var height = names.reduce(function (max, n) {
    return Math.max(max, lists[n].length);
  }, 0);

  var grid = [names];
  for (var r = 0; r < height; r++) {
    grid.push(
      names.map(function (n) {
        return lists[n][r] || '';
      })
    );
  }

  sheet.getRange(1, 1, grid.length, names.length).setValues(grid);
  sheet
    .getRange(1, 1, 1, names.length)
    .setFontWeight('bold')
    .setBackground('#002D72')
    .setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
  names.forEach(function (n, i) {
    sheet.setColumnWidth(i + 1, 150);
  });
  sheet.hideSheet();
  return sheet;
}

/** Seed the tables that are still empty. Anything with a row in it is left alone. */
function seedIfEmpty() {
  if (!dbSelect(T.SETTINGS).length) {
    dbWriteAll(
      T.SETTINGS,
      DEFAULT_SETTINGS().map(function (r) {
        return { Key: r[0], Value: r[1], 'What it does': r[2] };
      })
    );
  }

  if (!dbSelect(T.DOCS).length) importDocs(false);
  if (!dbSelect(T.PROJECTS).length) importLadder(false);

  if (!dbSelect(T.SKILLS).length) {
    dbWriteAll(
      T.SKILLS,
      SEED_SKILLS().map(function (s) {
        return { ID: s.id, Order: s.order, Section: s.section, Skill: s.skill };
      })
    );
  }
}

/**
 * Write the document library.
 *
 * @param {boolean} preserve  keep Status, Read on and My notes from what is already there
 */
function importDocs(preserve) {
  var kept = {};
  if (preserve) {
    dbSelect(T.DOCS).forEach(function (row) {
      kept[row.ID] = { Status: row.Status, 'Read on': row['Read on'], 'My notes': row['My notes'] };
    });
  }

  var rows = SEED_DOCS().map(function (d) {
    var prior = kept[d.id] || {};
    return {
      ID: d.id,
      Order: d.order,
      Folder: d.folder,
      Kind: d.kind,
      Title: d.title,
      Summary: d.summary,
      'Source file': d.source,
      Words: d.words,
      Status: prior.Status || 'Not started',
      'Read on': prior['Read on'] || '',
      'My notes': prior['My notes'] || '',
      Body: d.body
    };
  });

  var n = dbWriteAll(T.DOCS, rows);
  setSetting('Content version', Utilities.formatDate(new Date(), tz(), 'yyyy-MM-dd HH:mm') + ' - ' + n + ' documents');
  return n;
}

/**
 * Write the ladder.
 *
 * @param {boolean} preserve  keep everything she has recorded against each project
 */
function importLadder(preserve) {
  var kept = {};
  if (preserve) {
    dbSelect(T.PROJECTS).forEach(function (row) {
      kept[row.ID] = row;
    });
  }

  var rows = SEED_PROJECTS().map(function (p) {
    var prior = kept[p.id] || {};
    return {
      ID: p.id,
      Order: p.order,
      Tier: p.tier,
      Project: p.project,
      Account: p.account,
      Mode: p.mode,
      Safety: p.safety,
      'Goes live': p.live,
      'Time box': p.timeBox,
      Window: p.window,
      Deliverable: p.deliverable,
      'Doc ID': p.docId,
      'Same as': p.alias,
      Status: prior.Status || 'Not started',
      Started: prior.Started || '',
      Finished: prior.Finished || '',
      Hours: prior.Hours || '',
      'Deliverable link': prior['Deliverable link'] || '',
      Notes: prior.Notes || ''
    };
  });

  return dbWriteAll(T.PROJECTS, rows);
}

/** Refresh the content, keeping progress. This is the menu item to use after the source
 *  material changes and the Data files have been rebuilt. */
function reimportContent() {
  var docs = importDocs(true);
  var ladder = importLadder(true);
  buildDashboard();
  return 'Re-imported ' + docs + ' documents and ' + ladder + ' projects. Your progress and notes were kept.';
}

/** Rebuild structure only - headers, widths, dropdowns, colours. Data is untouched. */
function repairWorkbook() {
  buildListsSheet();
  SCHEMA().forEach(function (def) {
    ensureSheet(def);
  });
  buildDashboard();
  return 'Workbook structure repaired.';
}

/**
 * The dashboard. Everything on it is a live formula rather than a value written once, so it
 * stays right whether the underlying row changed in the Sheet or through the web app.
 */
function buildDashboard() {
  var book = ss();
  var sheet = book.getSheetByName(T.DASHBOARD) || book.insertSheet(T.DASHBOARD, 0);
  sheet.clear();
  sheet.getBandings().forEach(function (b) {
    b.remove();
  });
  sheet.setHiddenGridlines(true);

  var start =
    'IFERROR(INDEX(' + colRef(T.SETTINGS, 'Value') + ',MATCH("Start date",' + colRef(T.SETTINGS, 'Key') + ',0)),"")';
  var day = 'IF(' + start + '="","",TODAY()-' + start + '+1)';

  var tierCol = colRef(T.PROJECTS, 'Tier');
  var statusCol = colRef(T.PROJECTS, 'Status');
  var hoursCol = colRef(T.PROJECTS, 'Hours');
  var projectIds = colRef(T.PROJECTS, 'ID', true);
  var docStatus = colRef(T.DOCS, 'Status');
  var docIds = colRef(T.DOCS, 'ID', true);
  var questionStatus = colRef(T.QUESTIONS, 'Status');
  var wrongIds = colRef(T.WRONG, 'ID', true);
  var noteIds = colRef(T.NOTES, 'ID', true);
  var skillIds = colRef(T.SKILLS, 'ID', true);

  // Rows are pushed through a builder that remembers where each kind of row landed, so the
  // formatting below never depends on hand-counted row numbers.
  var rows = [];
  var mark = { title: [], heading: [], tableHead: [], label: [] };
  function push(row, kind) {
    rows.push(row);
    if (kind) mark[kind].push(rows.length);
    return rows.length;
  }
  function blank() {
    push(['', '', '', '', '', '']);
  }

  push(['The ramp', '', '', '', '', ''], 'title');
  blank();
  var dayRow = push(['Day', '=' + day, 'of 90', '', '', ''], 'label');
  var phaseRow = push(
    [
      'Phase',
      '=IF(' + day + '="","Set your start date on the Settings sheet",IF(' + day + '<1,"Not started yet",IF(' + day +
        '<=30,"Learn - read-only",IF(' + day + '<=60,"Assist - reversible and reviewed",IF(' + day +
        '<=90,"Own - independent within guardrails","Past day 90")))))',
      '', '', '', ''
    ],
    'label'
  );
  var startRow = push(['Start date', '=' + start, 'Edit this on the Settings sheet', '', '', ''], 'label');
  blank();

  push(['The ladder', '', '', '', '', ''], 'heading');
  push(['Tier', 'Projects', 'Done', 'In progress', 'Not started', 'Hours logged'], 'tableHead');

  ['Tier 1', 'Tier 2', 'Tier 3', 'Mecco', 'Tier 4'].forEach(function (tier) {
    var t = '"' + tier + '"';
    push(
      [
        tier,
        '=COUNTIF(' + tierCol + ',' + t + ')',
        '=COUNTIFS(' + tierCol + ',' + t + ',' + statusCol + ',"Done")',
        '=COUNTIFS(' + tierCol + ',' + t + ',' + statusCol + ',"In progress")',
        '=COUNTIFS(' + tierCol + ',' + t + ',' + statusCol + ',"Not started")',
        '=SUMIF(' + tierCol + ',' + t + ',' + hoursCol + ')'
      ],
      'label'
    );
  });

  push(
    [
      'All tiers',
      '=COUNTA(' + projectIds + ')',
      '=COUNTIF(' + statusCol + ',"Done")',
      '=COUNTIF(' + statusCol + ',"In progress")',
      '=COUNTIF(' + statusCol + ',"Not started")',
      '=SUM(' + hoursCol + ')'
    ],
    'tableHead'
  );

  blank();
  push(['Everything else', '', '', '', '', ''], 'heading');
  push(
    ['Reading', '=COUNTIF(' + docStatus + ',"Read")&" of "&COUNTA(' + docIds + ')&" read"', '', '', '', ''],
    'label'
  );
  push(['Questions open', '=COUNTIF(' + questionStatus + ',"Open")', '', '', '', ''], 'label');
  push(['Questions answered', '=COUNTIF(' + questionStatus + ',"Answered")', '', '', '', ''], 'label');
  push(
    ['Things I got wrong', '=COUNTA(' + wrongIds + ')', 'A long list here is a good outcome', '', '', ''],
    'label'
  );
  push(['Notes', '=COUNTA(' + noteIds + ')', '', '', '', ''], 'label');

  blank();
  push(['Self-assessment', '', '', '', '', ''], 'heading');
  push(['Scored', 'Not yet', 'Developing', 'Independent', 'Not rated', ''], 'tableHead');

  ['Day 1', 'Day 30', 'Day 90'].forEach(function (label) {
    var col = colRef(T.SKILLS, label);
    push(
      [
        label,
        '=COUNTIF(' + col + ',"Not yet")',
        '=COUNTIF(' + col + ',"Developing")',
        '=COUNTIF(' + col + ',"Independent")',
        '=COUNTA(' + skillIds + ')-COUNTIF(' + col + ',"Not yet")-COUNTIF(' + col +
          ',"Developing")-COUNTIF(' + col + ',"Independent")',
        ''
      ],
      'label'
    );
  });

  sheet.getRange(1, 1, rows.length, 6).setValues(rows);

  var all = sheet.getRange(1, 1, rows.length, 6);
  all.setFontFamily('Montserrat').setFontSize(10).setFontColor('#202124').setVerticalAlignment('middle');

  mark.title.forEach(function (r) {
    sheet.getRange(r, 1).setFontSize(22).setFontWeight('bold').setFontColor('#002D72');
  });
  mark.heading.forEach(function (r) {
    sheet.getRange(r, 1, 1, 6).setFontWeight('bold').setFontSize(13).setFontColor('#002D72');
  });
  mark.tableHead.forEach(function (r) {
    sheet.getRange(r, 1, 1, 6).setFontWeight('bold').setBackground('#DCE6F5').setFontColor('#002D72');
  });
  mark.label.forEach(function (r) {
    sheet.getRange(r, 1).setFontWeight('bold');
  });

  sheet.getRange(dayRow, 2).setFontSize(28).setFontWeight('bold').setFontColor('#002D72');
  sheet.getRange(phaseRow, 2).setFontWeight('bold');
  sheet.getRange(startRow, 2).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(startRow, 3).setFontColor('#5F6368');

  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 160);
  [3, 4, 5, 6].forEach(function (c) {
    sheet.setColumnWidth(c, 150);
  });
  sheet.setFrozenRows(0);
  return sheet;
}
