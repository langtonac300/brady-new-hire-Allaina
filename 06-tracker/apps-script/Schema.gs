/**
 * Schema.gs - what the database looks like.
 *
 * Every sheet in this workbook is a table, and every table is described here: its columns,
 * their widths, which ones get a dropdown, and which ones are too big to load unless asked
 * for. Setup.gs builds the workbook from this; Db.gs reads and writes through it.
 *
 * To add a column, add it here and re-run "Repair workbook" from the menu. Existing data is
 * kept - new columns are appended on the right.
 */

/** Sheet names, in one place so a rename is a one-line change. */
var T = {
  DASHBOARD: 'Dashboard',
  DOCS: 'Library',
  PROJECTS: 'Ladder',
  QUESTIONS: 'Questions',
  WRONG: 'What I got wrong',
  NOTES: 'Notes',
  SKILLS: 'Self-assessment',
  LISTS: 'Lists',
  SETTINGS: 'Settings'
};

/** Dropdown option lists. These are written to the Lists sheet and referenced by range, so
 *  editing an option there changes the dropdown everywhere without touching this file. */
function LISTS() {
  return {
    DocStatus: ['Not started', 'Reading', 'Read', 'Reference'],
    ProjectStatus: ['Not started', 'In progress', 'Blocked', 'Ready for readout', 'Done'],
    QuestionStatus: ['Open', 'Answered', 'Parked'],
    NoteKind: ['Meeting', 'Capture', 'Idea', 'Blocker', 'Readout'],
    Score: ['Not yet', 'Developing', 'Independent'],
    Tier: ['Tier 1', 'Tier 2', 'Tier 3', 'Mecco', 'Tier 4'],
    Mode: ['Paired', 'Solo'],
    YesNo: ['Yes', 'No']
  };
}

/**
 * The tables.
 *
 * Column options:
 *   w      column width in pixels
 *   list   name of a LISTS() key - becomes a dropdown
 *   type   'date' | 'number' | 'text' (default 'text')
 *   heavy  true = do not load unless the caller asks. Heavy columns must come last.
 *   wrap   true = wrap text in the cell
 */
function SCHEMA() {
  return [
    {
      name: T.DOCS,
      title: 'Library',
      colour: '#002D72',
      key: 'ID',
      columns: [
        { name: 'ID', w: 210 },
        { name: 'Order', w: 60, type: 'number' },
        { name: 'Folder', w: 120 },
        { name: 'Kind', w: 100 },
        { name: 'Title', w: 260 },
        { name: 'Summary', w: 320, wrap: true },
        { name: 'Source file', w: 220 },
        { name: 'Words', w: 70, type: 'number' },
        { name: 'Status', w: 110, list: 'DocStatus' },
        { name: 'Read on', w: 100, type: 'date' },
        { name: 'My notes', w: 320, wrap: true },
        { name: 'Updated', w: 140, type: 'date' },
        { name: 'Body', w: 420, heavy: true }
      ]
    },

    {
      name: T.PROJECTS,
      title: 'The ladder',
      colour: '#002D72',
      key: 'ID',
      columns: [
        { name: 'ID', w: 70 },
        { name: 'Order', w: 60, type: 'number' },
        { name: 'Tier', w: 80, list: 'Tier' },
        { name: 'Project', w: 300 },
        { name: 'Account', w: 170 },
        { name: 'Mode', w: 80, list: 'Mode' },
        { name: 'Safety', w: 160 },
        { name: 'Goes live', w: 90, list: 'YesNo' },
        { name: 'Time box', w: 130 },
        { name: 'Window', w: 110 },
        { name: 'Deliverable', w: 340, wrap: true },
        { name: 'Doc ID', w: 210 },
        // Set only on a row that is a pointer to another project rather than a project of its
        // own. T2-7 is the only one: it is the same work as M-1 and is tracked there.
        { name: 'Same as', w: 90 },
        { name: 'Status', w: 140, list: 'ProjectStatus' },
        { name: 'Started', w: 100, type: 'date' },
        { name: 'Finished', w: 100, type: 'date' },
        { name: 'Hours', w: 70, type: 'number' },
        { name: 'Deliverable link', w: 240 },
        { name: 'Notes', w: 340, wrap: true },
        { name: 'Updated', w: 140, type: 'date' }
      ]
    },

    {
      name: T.QUESTIONS,
      title: 'Questions',
      colour: '#0B6E4F',
      key: 'ID',
      columns: [
        { name: 'ID', w: 80 },
        { name: 'Asked on', w: 100, type: 'date' },
        { name: 'Question', w: 420, wrap: true },
        { name: 'Context', w: 300, wrap: true },
        { name: 'Project', w: 90 },
        { name: 'Status', w: 100, list: 'QuestionStatus' },
        { name: 'Answer', w: 420, wrap: true },
        { name: 'Answered on', w: 110, type: 'date' },
        { name: 'Answered by', w: 130 },
        { name: 'Updated', w: 140, type: 'date' }
      ]
    },

    {
      name: T.WRONG,
      title: 'What I got wrong',
      colour: '#8A4B08',
      key: 'ID',
      columns: [
        { name: 'ID', w: 80 },
        { name: 'Date', w: 100, type: 'date' },
        { name: 'Project', w: 90 },
        { name: 'I predicted', w: 340, wrap: true },
        { name: 'What actually happened', w: 340, wrap: true },
        { name: 'Why I was off', w: 340, wrap: true },
        { name: 'Habit to watch', w: 340, wrap: true },
        { name: 'Updated', w: 140, type: 'date' }
      ]
    },

    {
      name: T.NOTES,
      title: 'Notes',
      colour: '#4A4A4A',
      key: 'ID',
      columns: [
        { name: 'ID', w: 80 },
        { name: 'Date', w: 100, type: 'date' },
        { name: 'Kind', w: 100, list: 'NoteKind' },
        { name: 'Title', w: 300 },
        { name: 'Who', w: 150 },
        { name: 'Project', w: 90 },
        { name: 'Body', w: 520, wrap: true },
        { name: 'Follow-up', w: 300, wrap: true },
        { name: 'Done', w: 80, list: 'YesNo' },
        { name: 'Updated', w: 140, type: 'date' }
      ]
    },

    {
      name: T.SKILLS,
      title: 'Self-assessment',
      colour: '#002D72',
      key: 'ID',
      columns: [
        { name: 'ID', w: 70 },
        { name: 'Order', w: 60, type: 'number' },
        { name: 'Section', w: 240 },
        { name: 'Skill', w: 460, wrap: true },
        { name: 'Day 1', w: 120, list: 'Score' },
        { name: 'Day 30', w: 120, list: 'Score' },
        { name: 'Day 90', w: 120, list: 'Score' },
        { name: 'Evidence', w: 360, wrap: true },
        { name: 'Updated', w: 140, type: 'date' }
      ]
    },

    {
      name: T.SETTINGS,
      title: 'Settings',
      colour: '#4A4A4A',
      key: 'Key',
      columns: [
        { name: 'Key', w: 200 },
        { name: 'Value', w: 320 },
        { name: 'What it does', w: 460, wrap: true }
      ]
    }
  ];
}

/** Look up one table definition by sheet name. Throws rather than returning undefined, so a
 *  typo fails loudly at the call site instead of silently reading nothing. */
function tableDef(name) {
  var all = SCHEMA();
  for (var i = 0; i < all.length; i++) {
    if (all[i].name === name) return all[i];
  }
  throw new Error('No table called "' + name + '". Check Schema.gs.');
}

/** Settings written on first setup. Editable afterwards on the Settings sheet. */
function DEFAULT_SETTINGS() {
  return [
    ['Start date', '', 'Your day one. Set this and the dashboard works out which day and phase you are on.'],
    ['Display name', '', 'Shown in the header of the web app. Optional.'],
    ['Content version', '', 'Stamped automatically when content is imported. Do not edit.']
  ];
}
