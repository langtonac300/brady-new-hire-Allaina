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

/**
 * The tools, what each one owns, and its single gotcha.
 *
 * Every row here is transcribed from the source material. The Link column is deliberately
 * left blank: no URL for any of these is recorded anywhere in the source, and a
 * plausible-looking guess is the single most damaging thing this could contain. She fills
 * them in the first time she opens each one.
 */
function SEED_SYSTEMS() {
  var rows = [
    ['Google Ads', 'The platform. Standard access from day one - this is the one you operate.', 'Live spend and in-platform metrics, per account', 'Its Conversions column is not reported revenue. Live in-platform metrics only.', 'Day 1'],
    ['MTD Spend dashboard', "The team's spend and pacing view. A real internal dashboard - Alex shows you where.", 'Pacing against budget, blended spend', 'It is the pacing source, but reconcile a surprising figure against the platform before repeating it.', 'Day 1'],
    ['L10 Huddle app', 'Lives in the same workbook as the MTD Spend dashboard.', 'The weekly scorecard, to-dos, rocks, and your 1:1 page', 'Every number carries its caveat, and the caveat gets read out with it.', 'Day 1'],
    ['Google Chat', 'Where you ask questions and get unblocked.', 'Nothing - it is the route, not a source', 'Asking the moment you are stuck is expected rather than tolerated. Do not save it for the 1:1.', 'Day 1'],
    ['Calendar', 'The standing meetings.', 'Nothing - it is the schedule', 'Your invites are the authority. Any written schedule is the shape of a normal week, not the truth.', 'Day 1'],
    ['Google Sheets', 'A lot of Brady reporting is Sheets. Beyond basics means pivot tables, QUERY and FILTER.', 'The pacing note and the budget math', 'A pasted CSV can be silently truncated - what you are looking at may not be the whole table.', 'Day 1'],
    ['Microsoft/Bing Ads', 'The other search platform. Genuinely different from Google in ways that matter.', 'Bing spend and performance', 'Do not assume a Google habit transfers. BNG in a name means Bing.', 'End of week 2'],
    ['Power BI', 'The trend and reporting layer, owned by the analytics team.', 'Trends and the monthly story', 'Not the source. Every number in it is computed somewhere upstream - stay able to name where.', 'End of week 2'],
    ['Adobe Analytics', 'On-site behavior, and part of the reported-revenue picture.', 'On-site sessions and behavior', 'On-site sessions are not ad-platform clicks. Different questions, different tool.', 'End of week 2'],
    ['Jira', 'The department uses it, but day-to-day work with Alex runs through Chat and 1:1s.', 'Nothing you depend on', 'It is not the queue your work flows through - do not wait on a ticket to start.', 'End of week 2'],
    ['BigQuery / SQL', 'Where the reported first-touch numbers actually live. The biggest single unlock on the list.', 'Reported revenue, first-touch and 180-day', 'Never trust an invented table or column name, and reconcile any pull to a number you already believe.', 'Ask week 1 - via the analytics team, arrives late'],
    ['GTM', 'Google Tag Manager - the conversion-tracking layer, where the tags live. Introduced, not owned.', 'Whether a conversion fires correctly', 'The widest blast radius of anything you can touch. You learn to read it; a senior changes it.', 'Introduced, not owned']
  ];

  return rows.map(function (r) {
    return {
      Tool: r[0],
      'What it is': r[1],
      'What it owns': r[2],
      'The gotcha': r[3],
      'Access by': r[4],
      Status: 'Not requested',
      Link: ''
    };
  });
}

/**
 * The Google Ads scripts shipped alongside this workbook.
 *
 * All three are read-only - they run selectors and queries and write the results into a
 * sheet. None of them changes anything in an account, which is what makes them usable during
 * the read-only phase rather than after it.
 */
function SEED_SCRIPTS() {
  var rows = [
    ['GAS-1', 'Search terms export', 'Pulls search terms with impressions, clicks, cost and conversions into a tab in this workbook, stamped with the account timezone and a note that Conversions is the platform number.', 'Daily', 'The daily Keep/Kill review, T2-1, T2-2, T3-2', 'search-terms-export.js'],
    ['GAS-2', 'Account structure snapshot', 'Lists every campaign with its type, bidding strategy, daily budget and 30-day spend - the map you would otherwise build by hand on an account tour.', 'Weekly', 'T1-1, T1-2, T1-9', 'account-structure-snapshot.js'],
    ['GAS-3', 'Budget pacing check', 'Month-to-date spend against budget, normalized per business day, with the days elapsed and days remaining spelled out.', 'Daily', 'T2-4, T3-3', 'budget-pacing-check.js']
  ];

  return rows.map(function (r) {
    return {
      ID: r[0],
      Name: r[1],
      'What it does': r[2],
      'Reads or writes': 'Reads only',
      Account: '',
      Feeds: r[4],
      Status: 'Draft',
      Schedule: r[3],
      'Source file': r[5],
      Notes: ''
    };
  });
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
