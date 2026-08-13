/**
 * Api.gs - everything the browser is allowed to call.
 *
 * Each function returns {ok: true, data: ...} or {ok: false, error: "..."}, so the client has
 * one shape to handle and a failure shows up as a message in the interface rather than a
 * silent no-op.
 *
 * The three log tables share one set of handlers. They differ only in which sheet they write
 * to and what their IDs are prefixed with, and that is not worth three copies of the same code.
 */

/**
 * The three log tables.
 *
 * This is a function and not a top-level object on purpose. Apps Script concatenates every
 * .gs file into one script and runs the top-level statements in file order, so an object
 * literal here that reads T from Schema.gs would work or crash depending on which file the
 * editor happens to list first. A function body is not evaluated until it is called.
 */
function SECTIONS() {
  return {
    questions: { table: T.QUESTIONS, prefix: 'Q', dateField: 'Asked on', defaults: { Status: 'Open' } },
    wrong: { table: T.WRONG, prefix: 'W', dateField: 'Date', defaults: {} },
    notes: { table: T.NOTES, prefix: 'N', dateField: 'Date', defaults: { Kind: 'Capture', Done: 'No' } },
    daily: { table: T.DAILY, prefix: 'D', dateField: 'Date', defaults: { Posted: 'No', 'Keep/Kill done': 'No' } }
  };
}

function ok(data) {
  return { ok: true, data: data };
}

function fail(err) {
  return { ok: false, error: String(err && err.message ? err.message : err) };
}

function sectionDef(section) {
  var def = SECTIONS()[section];
  if (!def) throw new Error('Unknown section "' + section + '".');
  return def;
}

function today() {
  return Utilities.formatDate(new Date(), tz(), 'yyyy-MM-dd');
}

/** Day number and phase, worked out the same way the dashboard does it. */
function rampPosition() {
  var raw = getSetting('Start date');
  if (!raw) return { started: false, day: null, phase: 'Set your start date', startDate: '' };

  var parts = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  var startDate = parts ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])) : new Date(raw);
  if (isNaN(startDate.getTime())) return { started: false, day: null, phase: 'Start date not readable', startDate: String(raw) };

  var now = new Date();
  var a = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  var b = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  var day = Math.floor((b - a) / 86400000) + 1;

  var phase = 'Past day 90';
  if (day < 1) phase = 'Not started yet';
  else if (day <= 30) phase = 'Learn - read-only';
  else if (day <= 60) phase = 'Assist - reversible and reviewed';
  else if (day <= 90) phase = 'Own - independent within guardrails';

  return {
    started: true,
    day: day,
    phase: phase,
    startDate: Utilities.formatDate(startDate, tz(), 'yyyy-MM-dd')
  };
}

/**
 * Everything the app needs to draw itself, in one round trip. Document bodies are left out -
 * they are fetched one at a time as she opens them.
 */
function apiBootstrap() {
  try {
    return ok({
      today: today(),
      position: rampPosition(),
      displayName: getSetting('Display name'),
      contentVersion: getSetting('Content version'),
      lists: LISTS(),
      docs: dbSelect(T.DOCS),
      projects: dbSelect(T.PROJECTS),
      skills: dbSelect(T.SKILLS),
      questions: dbSelect(T.QUESTIONS),
      wrong: dbSelect(T.WRONG),
      notes: dbSelect(T.NOTES),
      daily: dbSelect(T.DAILY),
      systems: dbSelect(T.SYSTEMS),
      scripts: dbSelect(T.SCRIPTS)
    });
  } catch (err) {
    return fail(err);
  }
}

/** One document, body included. */
function apiGetDoc(id) {
  try {
    var doc = dbGet(T.DOCS, id);
    if (!doc) throw new Error('No document with ID "' + id + '".');
    return ok(doc);
  } catch (err) {
    return fail(err);
  }
}

/**
 * One concept diagram, as a data URI.
 *
 * The diagrams are the only images not inlined into the page. Each is a full slide of about
 * 70 KB and each belongs to one or two of the 63 documents, so they are fetched the way
 * document bodies are - when something needs one - rather than loaded on every screen by
 * everyone. See DataDiagrams.gs.
 */
function apiGetDiagram(key) {
  try {
    var uri = DATA_DIAGRAMS()[key];
    if (!uri) throw new Error('No diagram called "' + key + '".');
    return ok(uri);
  } catch (err) {
    return fail(err);
  }
}

/** Update a document's reading status or notes. Marking something Read stamps the date if
 *  it does not already have one; un-reading it clears the date again. */
function apiSaveDoc(id, patch) {
  try {
    var clean = {};
    ['Status', 'My notes'].forEach(function (f) {
      if (patch[f] !== undefined) clean[f] = patch[f];
    });

    if (clean.Status !== undefined) {
      var current = dbGet(T.DOCS, id);
      if (!current) throw new Error('No document with ID "' + id + '".');
      if (clean.Status === 'Read') {
        if (!current['Read on']) clean['Read on'] = today();
      } else {
        clean['Read on'] = '';
      }
    }

    return ok(dbUpdate(T.DOCS, id, clean));
  } catch (err) {
    return fail(err);
  }
}

/** Update a project. Starting one stamps Started; finishing one stamps Finished. */
function apiSaveProject(id, patch) {
  try {
    var allowed = [
      'Status', 'Started', 'Finished', 'Hours', 'Deliverable link', 'Notes',
      'Prediction', 'Predicted on', 'Timebox held'
    ];
    var clean = {};
    allowed.forEach(function (f) {
      if (patch[f] !== undefined) clean[f] = patch[f];
    });

    // Writing a prediction stamps the day it was written. That date is what makes it a
    // prediction rather than a recollection, so it is set here rather than trusted from the
    // browser, and it is never overwritten once set.
    if (clean.Prediction !== undefined && String(clean.Prediction).trim()) {
      var before = dbGet(T.PROJECTS, id);
      if (before && !before['Predicted on']) clean['Predicted on'] = today();
    }

    if (clean.Status !== undefined) {
      var current = dbGet(T.PROJECTS, id);
      if (!current) throw new Error('No project with ID "' + id + '".');
      var moving = clean.Status !== 'Not started';
      if (moving && !current.Started && clean.Started === undefined) clean.Started = today();
      if (clean.Status === 'Done' && !current.Finished && clean.Finished === undefined) clean.Finished = today();
      if (clean.Status === 'Not started') {
        if (clean.Started === undefined) clean.Started = '';
        if (clean.Finished === undefined) clean.Finished = '';
      }
      if (clean.Status !== 'Done' && clean.Finished === undefined) clean.Finished = '';
    }

    return ok(dbUpdate(T.PROJECTS, id, clean));
  } catch (err) {
    return fail(err);
  }
}

/** Update one self-assessment score or its evidence. */
function apiSaveSkill(id, patch) {
  try {
    var clean = {};
    ['Day 1', 'Day 30', 'Day 90', 'Evidence'].forEach(function (f) {
      if (patch[f] !== undefined) clean[f] = patch[f];
    });
    return ok(dbUpdate(T.SKILLS, id, clean));
  } catch (err) {
    return fail(err);
  }
}

/** Add a row to questions, what-I-got-wrong or notes. */
function apiCreate(section, record) {
  try {
    var def = sectionDef(section);
    var row = {};
    Object.keys(def.defaults).forEach(function (k) {
      row[k] = def.defaults[k];
    });
    Object.keys(record || {}).forEach(function (k) {
      if (record[k] !== undefined && k !== 'ID' && k !== '_row') row[k] = record[k];
    });

    if (!row[def.dateField]) row[def.dateField] = today();

    return ok(dbInsertWithId(def.table, def.prefix, row));
  } catch (err) {
    return fail(err);
  }
}

/** Patch a row. Answering a question stamps the date and flips it to Answered. */
function apiUpdate(section, id, patch) {
  try {
    var def = sectionDef(section);
    var clean = {};
    Object.keys(patch || {}).forEach(function (k) {
      if (k !== 'ID' && k !== '_row' && k !== 'Updated') clean[k] = patch[k];
    });

    if (section === 'questions' && clean.Answer && String(clean.Answer).trim()) {
      var current = dbGet(T.QUESTIONS, id);
      if (current && !current['Answered on'] && clean['Answered on'] === undefined) clean['Answered on'] = today();
      if (current && current.Status === 'Open' && clean.Status === undefined) clean.Status = 'Answered';
    }

    return ok(dbUpdate(def.table, id, clean));
  } catch (err) {
    return fail(err);
  }
}

function apiDelete(section, id) {
  try {
    var def = sectionDef(section);
    return ok(dbDelete(def.table, id));
  } catch (err) {
    return fail(err);
  }
}

/** Reload one log table after a change, so the client does not re-fetch everything. */
function apiReload(section) {
  try {
    return ok(dbSelect(sectionDef(section).table));
  } catch (err) {
    return fail(err);
  }
}

/** Update one row on the Systems or Scripts sheet. */
function apiSaveSystem(tool, patch) {
  try {
    var clean = {};
    ['Status', 'Requested', 'Granted', 'Link', 'Notes'].forEach(function (f) {
      if (patch[f] !== undefined) clean[f] = patch[f];
    });
    if (clean.Status === 'Requested') {
      var current = dbGet(T.SYSTEMS, tool);
      if (current && !current.Requested && clean.Requested === undefined) clean.Requested = today();
    }
    if (clean.Status === 'Granted') {
      var row = dbGet(T.SYSTEMS, tool);
      if (row && !row.Granted && clean.Granted === undefined) clean.Granted = today();
    }
    return ok(dbUpdate(T.SYSTEMS, tool, clean));
  } catch (err) {
    return fail(err);
  }
}

function apiSaveScript(id, patch) {
  try {
    var clean = {};
    ['Account', 'Status', 'Schedule', 'Last run', 'Notes'].forEach(function (f) {
      if (patch[f] !== undefined) clean[f] = patch[f];
    });
    return ok(dbUpdate(T.SCRIPTS, id, clean));
  } catch (err) {
    return fail(err);
  }
}

/**
 * Search everything.
 *
 * Document bodies are not held in the browser - they are 350 KB and they are only fetched one
 * at a time - so full-text search over them has to happen here. Her own writing is searched
 * too, because "what did I say about attribution" is at least as common a question as "where
 * does the material cover it".
 */
function apiSearch(query) {
  try {
    var needle = String(query || '').trim().toLowerCase();
    if (needle.length < 2) return ok({ query: needle, documents: [], entries: [] });

    var documents = [];
    dbSelect(T.DOCS, { heavy: true }).forEach(function (doc) {
      var body = String(doc.Body || '');
      var hay = body.toLowerCase();
      var at = hay.indexOf(needle);
      var inTitle = String(doc.Title || '').toLowerCase().indexOf(needle) !== -1;
      if (at === -1 && !inTitle) return;

      var hits = 0;
      var from = 0;
      while (from !== -1 && hits < 99) {
        from = hay.indexOf(needle, from);
        if (from === -1) break;
        hits++;
        from += needle.length;
      }

      documents.push({
        id: doc.ID,
        title: doc.Title,
        folder: doc.Folder,
        status: doc.Status,
        hits: hits,
        inTitle: inTitle,
        snippet: at === -1 ? String(doc.Summary || '') : snippet_(body, at, needle.length)
      });
    });

    documents.sort(function (a, b) {
      if (a.inTitle !== b.inTitle) return a.inTitle ? -1 : 1;
      return b.hits - a.hits;
    });

    // Her own writing, across every table that holds prose.
    var entries = [];
    var searchable = [
      { section: 'questions', table: T.QUESTIONS, label: 'Question', fields: ['Question', 'Context', 'Answer'] },
      { section: 'wrong', table: T.WRONG, label: 'What I got wrong', fields: ['I predicted', 'What actually happened', 'Why I was off', 'Habit to watch'] },
      { section: 'notes', table: T.NOTES, label: 'Note', fields: ['Title', 'Who', 'Body', 'Follow-up'] },
      { section: 'daily', table: T.DAILY, label: 'Daily line', fields: ['Worked on', 'Learned', 'Surprised me'] },
      { section: 'projects', table: T.PROJECTS, label: 'Project', fields: ['Project', 'Prediction', 'Notes'] }
    ];

    searchable.forEach(function (spec) {
      dbSelect(spec.table).forEach(function (row) {
        for (var i = 0; i < spec.fields.length; i++) {
          var text = String(row[spec.fields[i]] || '');
          var at = text.toLowerCase().indexOf(needle);
          if (at === -1) continue;
          entries.push({
            section: spec.section,
            label: spec.label,
            id: row.ID || row.Tool,
            field: spec.fields[i],
            snippet: snippet_(text, at, needle.length)
          });
          return;
        }
      });
    });

    return ok({ query: needle, documents: documents.slice(0, 40), entries: entries.slice(0, 60) });
  } catch (err) {
    return fail(err);
  }
}

/** A window of text around a hit, cut at word boundaries so it reads as a phrase. */
function snippet_(text, at, length) {
  var start = Math.max(0, at - 70);
  var end = Math.min(text.length, at + length + 90);
  var out = text.slice(start, end).replace(/\s+/g, ' ').trim();
  if (start > 0) out = '...' + out;
  if (end < text.length) out = out + '...';
  return out;
}

function apiSetSetting(key, value) {
  try {
    if (['Start date', 'Display name'].indexOf(key) === -1) throw new Error('That setting is not editable here.');

    // The start date is stored as a real date, not the string it arrives as - the dashboard
    // does arithmetic on it, and a text cell that merely looks like a date is the kind of
    // thing that works until it quietly does not.
    var stored = value;
    if (key === 'Start date' && value) {
      var parts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!parts) throw new Error('Use a date in the form 2026-08-13.');
      stored = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    }

    setSetting(key, stored);
    return ok({ position: rampPosition(), displayName: getSetting('Display name') });
  } catch (err) {
    return fail(err);
  }
}
