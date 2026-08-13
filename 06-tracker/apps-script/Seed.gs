/**
 * Seed.gs - the structured rows the workbook starts with.
 *
 * The document bodies live in the generated Data*.gs files. This file holds the two tables
 * that are structure rather than prose: the project ladder and the self-assessment. Both are
 * transcribed from the source material and both are seeded once, on setup - after that the
 * Sheet is the live copy and re-importing will not overwrite progress.
 *
 * The ladder is complete: Tier 1, Tier 2, Tier 3, the Mecco track and the Tier 4 capstone.
 * Two gaps in it are deliberate and must stay:
 *   - T2-7 has no brief of its own. It is the same project as M-1, listed here as a pointer
 *     so the ladder reads correctly, and tracked on M-1.
 *   - There is no M-4. The numbering skips it on purpose. Do not renumber M-5 to close it.
 */

/** Windows and safety tiers, kept out of the rows below so they stay readable. */
var TIER_META = {
  'Tier 1': { window: 'Days 1-25', safety: 'Read-only', order: 100 },
  'Tier 2': { window: 'Days 20-45', safety: 'Reversible, reviewed', order: 200 },
  'Tier 3': { window: 'Days 43-70', safety: 'Reversible, reviewed', order: 300 },
  Mecco: { window: 'Days 25-90', safety: 'Independent, guardrails', order: 400 },
  'Tier 4': { window: 'Days 70-90', safety: 'Independent, guardrails', order: 500 }
};

/**
 * The ladder. `live` marks the projects that touch a live account; `alias` marks a row that
 * is a pointer to another project rather than a project of its own.
 */
function SEED_PROJECTS() {
  var rows = [
    // Tier 1 - one-hour projects, read-only. Two a week, one paired and one solo.
    ['T1-1', 'Tier 1', 'Account tour, narrated', 'PDC Healthcare', 'Paired', '1 hour', 'A one-page structure map', 't1-01-account-tour'],
    ['T1-2', 'Tier 1', 'The same tour on a different animal', 'Seton US', 'Solo', '1 hour', 'Three structural differences, with reasons', 't1-02-a-different-animal'],
    ['T1-3', 'Tier 1', 'Keyword vs. search term', 'PDC Healthcare', 'Solo', '1 hour', 'An annotated 30-row list', 't1-03-keyword-vs-search-term'],
    ['T1-4', 'Tier 1', 'Conversion-action inventory', 'PDC Healthcare', 'Paired', '1 hour', 'The inventory plus one conclusion', 't1-04-conversion-action-inventory'],
    ['T1-5', 'Tier 1', 'Source and caveat the slide', 'PDC and Seton', 'Paired', '1 hour', 'An annotated Deep Dive slide', 't1-05-source-and-caveat-the-slide'],
    ['T1-6', 'Tier 1', 'Guardrail drill', 'PDC and Seton', 'Paired', '1 hour', 'Ten calls, plus what looked wrong', 't1-06-guardrail-drill'],
    ['T1-7', 'Tier 1', 'Brand vs. non-brand', 'Seton US', 'Solo', '1 hour', 'The split plus what keeps them apart', 't1-07-brand-vs-nonbrand'],
    ['T1-8', 'Tier 1', 'The timezone trap', 'PDC + Seton + EMEDCO', 'Solo', '1 hour', 'Three numbers and a rule', 't1-08-the-timezone-trap'],
    ['T1-9', 'Tier 1', 'PMax with no feed', 'PDC Wristbands', 'Solo', '1 hour', 'Half a page', 't1-09-pmax-with-no-feed'],
    ['T1-10', 'Tier 1', 'Competitor-outrank teardown', 'PDC Wristbands', 'Solo', '1 hour', 'A recommendation with a number', 't1-10-competitor-outrank-teardown'],
    ['T1-11', 'Tier 1', 'The ROAS puzzle', 'Seton + EMEDCO', 'Paired', '1 hour', 'Hypothesis, answer, and the gap between', 't1-11-the-roas-puzzle'],
    ['T1-12', 'Tier 1', "Don't clean that up", 'EMEDCO', 'Solo', '1 hour', 'What breaks if the "junk" goes', 't1-12-dont-clean-that-up'],

    // Tier 2 - half-day projects, reviewed. Only T2-3 touches a live PDC account.
    ['T2-1', 'Tier 2', 'SQR predict-then-compare, 50 terms', 'PDC Healthcare', 'Solo', 'Half a day', "Your calls, Alex's calls, every disagreement explained", 't2-01-sqr-predict-then-compare'],
    ['T2-2', 'Tier 2', 'The same drill at scale', 'Seton / EMEDCO', 'Solo', 'Half a day', 'Same format plus one observation about the loop', 't2-02-the-same-drill-at-scale'],
    ['T2-3', 'Tier 2', 'Negative-keyword build v1', 'PDC Wristbands', 'Solo', 'Half a day', 'The list, the architecture, a before/after estimate', 't2-03-negative-keyword-build-v1', 'live'],
    ['T2-4', 'Tier 2', 'The pacing note', 'PDC', 'Solo', 'Half a day', 'Five lines', 't2-04-the-pacing-note'],
    ['T2-5', 'Tier 2', 'Feed-label QA', 'Seton US', 'Solo', 'Half a day', 'The QA plus flagged rows, routed to Alex', 't2-05-feed-label-qa'],
    ['T2-6', 'Tier 2', 'Ad copy audit against brand', 'PDC Healthcare', 'Solo', 'Half a day', 'The audit plus five rewritten headlines', 't2-06-ad-copy-audit'],
    ['T2-7', 'Tier 2', 'Find everything wrong with this account', 'Mecco', 'Solo', 'Half a day', 'Same project as M-1 - tracked there', 'm-01-the-defect-audit', 'alias:M-1'],
    ['T2-8', 'Tier 2', 'Trace one click end to end', 'PDC + EMEDCO', 'Solo', 'Half a day', 'The trace diagram plus where it could break', 't2-08-trace-one-click'],

    // Tier 3 - one-to-two-day diagnosis work. T3-5 is the one that goes live.
    ['T3-1', 'Tier 3', 'The first conversion-tracking pass', 'PDC Healthcare', 'Solo', '1-2 days', 'A documented diagnosis plus the checks to run', 't3-01-first-conversion-tracking-pass'],
    ['T3-2', 'Tier 3', 'Waste at scale', 'Seton / EMEDCO', 'Solo', '1-2 days', 'A quantified waste map plus one structural fix', 't3-02-waste-at-scale'],
    ['T3-3', 'Tier 3', 'A budget recommendation', 'PDC', 'Solo', '1-2 days', 'A one-page rec with the guardrail math', 't3-03-a-budget-recommendation'],
    ['T3-4', 'Tier 3', 'A process gap, found and specced', 'The negatives loop', 'Solo', '1-2 days', 'A coverage map plus a one-page spec', 't3-04-a-process-gap-found-and-specced'],
    ['T3-5', 'Tier 3', 'Your first experiment', 'A higher-traffic campaign', 'Solo', '1-2 days', 'The design, then the honest readout', 't3-05-your-first-experiment', 'live'],

    // Mecco - the account she actually owns. Do them in order: M-1 finds what M-2 and M-3 fix.
    ['M-1', 'Mecco', 'The defect audit', 'Mecco', 'Solo', 'Half a day', 'A defect list, ranked by cost', 'm-01-the-defect-audit'],
    ['M-2', 'Mecco', 'Fix the $1 conversion values', 'Mecco', 'Solo', 'Half a day', 'A value model - and your first live change', 'm-02-fix-the-conversion-values', 'live'],
    ['M-3', 'Mecco', 'Attach and build the negatives', 'Mecco', 'Solo', 'Half a day', 'The list attached plus a first build', 'm-03-attach-and-build-the-negatives', 'live'],
    ['M-5', 'Mecco', 'Own it', 'Mecco', 'Solo', 'Ongoing from ~day 45', "A standing weekly line that's yours", 'm-05-own-it', 'live'],

    // Tier 4 - the capstone. One arc on Mecco, four stages, done in order.
    ['T4-1', 'Tier 4', 'Where the money goes', 'Mecco', 'Solo', '2-3 days', 'The spend, search-term and Quality Score diagnosis - plus the change log', 't4-01-where-the-money-goes'],
    ['T4-2', 'Tier 4', 'A second way in', 'Mecco', 'Solo', '2-3 days', 'A new conversion action: what it is, what it is worth, primary or secondary', 't4-02-a-second-way-in'],
    ['T4-3', 'Tier 4', 'The landing page test', 'Mecco', 'Solo', '1 day to design, then it runs', 'The design and the power math, then the honest readout', 't4-03-the-landing-page-test', 'live'],
    ['T4-4', 'Tier 4', 'What it should spend', 'Mecco', 'Solo', '1-2 days', 'A budget recommendation and the order campaigns get turned on', 't4-04-what-it-should-spend']
  ];

  var seen = {};
  return rows.map(function (r) {
    var tier = r[1];
    var meta = TIER_META[tier];
    seen[tier] = (seen[tier] || 0) + 1;
    var flag = r[8] || '';
    return {
      id: r[0],
      order: meta.order + seen[tier],
      tier: tier,
      project: r[2],
      account: r[3],
      mode: r[4],
      timeBox: r[5],
      deliverable: r[6],
      docId: '03-projects/' + r[7],
      window: meta.window,
      safety: meta.safety,
      live: flag === 'live' ? 'Yes' : 'No',
      alias: flag.indexOf('alias:') === 0 ? flag.slice(6) : ''
    };
  });
}

/**
 * The Day-1 baseline, section by section. Scores are left blank - she fills them in before
 * any training starts, then again at Day 30 and Day 90.
 */
function SEED_SKILLS() {
  var sections = [
    ['A', 'Foundational paid-search skills', [
      "Read a Google Ads account and explain what it's doing",
      'Explain the difference between a keyword and a search term',
      'Explain match types and when each one is right',
      'Identify campaign types (Search / Shopping / PMax / DemandGen / DSA)',
      'Explain manual vs. smart bidding, and what tROAS/tCPA actually do',
      'Explain what a product feed is and what breaks when one breaks'
    ]],
    ['B', 'How Brady measures things', [
      "Explain which attribution model Brady's reported numbers use",
      'Explain why platform "Conversions" differ from reported revenue',
      'Say whether a given number is inside its guardrail',
      "Know when a number can't be trusted, and why",
      'Describe what changed and why, framed per business day'
    ]],
    ['C', 'The accounts', [
      'PDC Healthcare: structure, feed, audience',
      'PDC Wristbands: the Shopify stack and why its ROAS looks the way it does',
      'Seton / EMEDCO: what they sell and how they differ from each other',
      'Mecco: what it is and what state it is in',
      'Explain how a conversion action is configured and why it matters'
    ]],
    ['D', 'Operating rhythm', [
      'Run a daily search-terms review and make Keep/Kill calls',
      "Check budget pacing and spot when something's off",
      'Bring an agenda and numbers to a 1:1',
      'Contribute to the weekly team huddle',
      'Pull the numbers for a monthly review and write the story behind them'
    ]],
    ['E', 'Judgment', [
      "Make a change to a live account safely, and know what's reversible",
      'Bring a recommendation rather than an open question',
      'Argue for increasing spend when the numbers support it',
      "Know what's mine to decide and what to escalate"
    ]],
    ['F', 'Tools', [
      'Google Ads',
      'Google Sheets (beyond the basics)',
      'Power BI',
      'Adobe Analytics',
      'BigQuery / SQL',
      'Using AI tools for real work, not just questions'
    ]]
  ];

  var out = [];
  sections.forEach(function (section, si) {
    section[2].forEach(function (skill, i) {
      out.push({
        id: section[0] + (i + 1),
        order: (si + 1) * 100 + (i + 1),
        section: section[0] + ' - ' + section[1],
        skill: skill
      });
    });
  });
  return out;
}

/** Every generated content module, concatenated. */
function SEED_DOCS() {
  return []
    .concat(DATA_OVERVIEW())
    .concat(DATA_START_HERE())
    .concat(DATA_LEARNING())
    .concat(DATA_PROJECTS_A())
    .concat(DATA_PROJECTS_B())
    .concat(DATA_WORKSPACE());
}
