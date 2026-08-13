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
    notes: { table: T.NOTES, prefix: 'N', dateField: 'Date', defaults: { Kind: 'Capture', Done: 'No' } }
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
      notes: dbSelect(T.NOTES)
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
    var allowed = ['Status', 'Started', 'Finished', 'Hours', 'Deliverable link', 'Notes'];
    var clean = {};
    allowed.forEach(function (f) {
      if (patch[f] !== undefined) clean[f] = patch[f];
    });

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
