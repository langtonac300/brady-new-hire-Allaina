/**
 * GENERATED FILE - do not edit here.
 *
 * Rebuild it from 06-tracker/intake/questions.json with tools/build-intake.mjs, then
 * paste the result back in. Editing this file by hand means the next rebuild silently
 * discards your change.
 */

/** The intake questionnaire: 43 questions in 9 sections. */
function DATA_INTAKE() {
  return {
    "source": "01-start-here/about-how-you-work.md",
    "sections": [
      {
        "id": 1,
        "title": "What you've actually touched",
        "questions": [
          {
            "type": "note",
            "text": "Not what you studied - what you've genuinely used, even a little. A \"Never\" here isn't a problem. A hidden one is. Each one changes what we do about it."
          },
          {
            "key": "s1.google-ads-or-any-ad-platform",
            "type": "pick",
            "text": "Google Ads (or any ad platform)",
            "options": [
              "Never",
              "Poked at it",
              "Used it properly"
            ]
          },
          {
            "key": "s1.google-sheets-excel-filtering-sorting-a",
            "type": "pick",
            "text": "Google Sheets / Excel - filtering, sorting, a pivot table",
            "options": [
              "Never",
              "Poked at it",
              "Used it properly"
            ]
          },
          {
            "key": "s1.any-analytics-tool-ga-adobe-similar",
            "type": "pick",
            "text": "Any analytics tool (GA, Adobe, similar)",
            "options": [
              "Never",
              "Poked at it",
              "Used it properly"
            ]
          },
          {
            "key": "s1.sql-or-any-query-language",
            "type": "pick",
            "text": "SQL, or any query language",
            "options": [
              "Never",
              "Poked at it",
              "Used it properly"
            ]
          },
          {
            "key": "s1.a-dashboard-tool-power-bi-tableau-looker",
            "type": "pick",
            "text": "A dashboard tool - Power BI, Tableau, Looker, similar",
            "options": [
              "Never",
              "Poked at it",
              "Used it properly"
            ]
          },
          {
            "key": "s1.working-in-a-spreadsheet-with-more-than",
            "type": "pick",
            "text": "Working in a spreadsheet with more than a few thousand rows",
            "options": [
              "Never",
              "Poked at it",
              "Used it properly"
            ]
          },
          {
            "key": "s1.an-ai-assistant-for-real-work-rather-tha",
            "type": "pick",
            "text": "An AI assistant, for real work rather than curiosity",
            "options": [
              "Never",
              "Poked at it",
              "Used it properly"
            ]
          },
          {
            "key": "s1.anything-else-you-ve-used-that-we-haven",
            "type": "text",
            "text": "Anything else you've used that we haven't listed?"
          }
        ]
      },
      {
        "id": 2,
        "title": "How you learn best",
        "questions": [
          {
            "type": "note",
            "text": "Rank the next four 1-4, where 1 is what works best for you."
          },
          {
            "key": "s2.reading-it-and-working-it-out",
            "type": "rank",
            "text": "Reading it and working it out",
            "hint": "1 = works best, 4 = works least well"
          },
          {
            "key": "s2.watching-someone-do-it-then-doing-it",
            "type": "rank",
            "text": "Watching someone do it, then doing it",
            "hint": "1 = works best, 4 = works least well"
          },
          {
            "key": "s2.being-told-the-concept-out-loud-then-try",
            "type": "rank",
            "text": "Being told the concept out loud, then trying",
            "hint": "1 = works best, 4 = works least well"
          },
          {
            "key": "s2.just-doing-it-and-asking-when-it-breaks",
            "type": "rank",
            "text": "Just doing it and asking when it breaks",
            "hint": "1 = works best, 4 = works least well"
          },
          {
            "key": "s2.when-you-hit-a-concept-that-doesn-t-land",
            "type": "pick",
            "text": "When you hit a concept that doesn't land, what do you normally do?",
            "options": [
              "Read it again, slower",
              "Go and find a different explanation of the same thing",
              "Skip it and come back once something else has clicked",
              "Go looking for a concrete example to work through"
            ]
          },
          {
            "key": "s2.do-you-want-the-why-before-the-how-or-do",
            "type": "text",
            "text": "Do you want the why before the how, or do you want to do the thing first and get the reasoning after?"
          },
          {
            "key": "s2.is-there-a-course-video-series-or-way-of",
            "type": "text",
            "text": "Is there a course, video series or way of learning that's worked well for you before?"
          }
        ]
      },
      {
        "id": 3,
        "title": "When something isn't going well",
        "questions": [
          {
            "key": "s3.when-you-get-stuck-on-something-what-do",
            "type": "pick",
            "text": "When you get stuck on something, what do you usually do first?",
            "options": [
              "Ask straight away",
              "Try for a bit, then ask",
              "Keep going until I've cracked it or run out of day"
            ]
          },
          {
            "key": "s3.where-would-you-rather-ask",
            "type": "pick",
            "text": "Where would you rather ask?",
            "options": [
              "The team chat channel, where anyone can answer",
              "A direct message to Alex or Courtney",
              "Saved up for a scheduled conversation"
            ]
          },
          {
            "key": "s3.how-do-you-like-to-get-feedback",
            "type": "pick",
            "text": "How do you like to get feedback?",
            "options": [
              "In the moment, as it happens",
              "At the end of the session, all together",
              "Written down afterwards so I can sit with it"
            ]
          },
          {
            "key": "s3.would-you-rather-be-told-when-you-re-hea",
            "type": "text",
            "text": "Would you rather be told when you're heading the wrong way, or be allowed to get there and work it out?"
          },
          {
            "key": "s3.how-does-it-feel-to-be-wrong-in-front-of",
            "type": "text",
            "text": "How does it feel to be wrong in front of someone?",
            "hint": "A scheduling question, not a character one - a lot of this ramp is predict-then-compare."
          },
          {
            "key": "s3.if-you-had-too-much-on-how-would-we-know",
            "type": "text",
            "text": "If you had too much on, how would we know?",
            "hint": "Some people go quiet, some ask more questions, some say it plainly. Tell us your tell."
          }
        ]
      },
      {
        "id": 4,
        "title": "Pace, and how much room you've actually got",
        "questions": [
          {
            "key": "s4.which-is-more-true-of-you",
            "type": "pick",
            "text": "Which is more true of you?",
            "options": [
              "I'd rather move fast and go back over things later",
              "I'd rather go slowly and feel solid before moving on"
            ]
          },
          {
            "key": "s4.if-you-finish-something-early-would-you",
            "type": "text",
            "text": "If you finish something early, would you rather have more work, or go deeper on what you just did?"
          },
          {
            "key": "s4.how-much-of-your-week-do-you-expect-to-h",
            "type": "text",
            "text": "How much of your week do you expect to have for the training projects, realistically, once meetings and everything else land?"
          },
          {
            "key": "s4.do-deadlines-help-you-or-stress-you",
            "type": "pick",
            "text": "Do deadlines help you or stress you?",
            "options": [
              "Give me a date. I work toward them",
              "Give me an order and let me pace it",
              "A date, but I'd like it to be a soft one"
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Meetings, and speaking in them",
        "questions": [
          {
            "key": "s5.how-do-you-feel-about-talking-in-a-room",
            "type": "pick",
            "text": "How do you feel about talking in a room of people you don't know yet?",
            "options": [
              "Fine. I'd rather join in early than sit silent",
              "Depends on the room. I'll warm up",
              "I'd rather listen for a while first"
            ]
          },
          {
            "key": "s5.would-you-rather-be-asked-something-cold",
            "type": "pick",
            "text": "Would you rather be asked something cold in a meeting, or get a heads-up beforehand?",
            "options": [
              "Cold is fine",
              "A heads-up, so I can think about it",
              "A heads-up, and ideally the first few times are rehearsed with Alex"
            ]
          },
          {
            "key": "s5.anything-about-meetings-that-s-worked-ba",
            "type": "text",
            "text": "Anything about meetings that's worked badly for you before?",
            "hint": "Worth saying now, while the calendar is still being built."
          }
        ]
      },
      {
        "id": 6,
        "title": "When and where you do your best work",
        "questions": [
          {
            "key": "s6.when-in-the-day-do-you-think-most-clearl",
            "type": "pick",
            "text": "When in the day do you think most clearly?",
            "options": [
              "Early - mornings are my good hours",
              "Middle of the day",
              "Later - I get going in the afternoon",
              "Genuinely doesn't matter"
            ]
          },
          {
            "key": "s6.would-you-rather-have-paired-sessions-cl",
            "type": "text",
            "text": "Would you rather have paired sessions clustered into a couple of days, or spread across the week?"
          },
          {
            "key": "s6.anything-about-your-setup-tools-or-envir",
            "type": "text",
            "text": "Anything about your setup, tools or environment that would help?",
            "hint": "Screens, note-taking, where you like to work from. Fine to leave blank."
          }
        ]
      },
      {
        "id": 7,
        "title": "Where you're starting from",
        "questions": [
          {
            "key": "s7.have-you-worked-with-anything-industrial",
            "type": "text",
            "text": "Have you worked with anything industrial, safety-related, healthcare or B2B before?",
            "hint": "Not a requirement - it tells us how much category background to fill in."
          },
          {
            "type": "note",
            "text": "Have you worked next to any of these? Tick anything you've been close to, even secondhand. Each one is a shortcut if you have it."
          },
          {
            "key": "s7.seo",
            "type": "pick",
            "text": "SEO",
            "options": [
              "Yes",
              "No"
            ]
          },
          {
            "key": "s7.email-or-lifecycle-marketing",
            "type": "pick",
            "text": "Email or lifecycle marketing",
            "options": [
              "Yes",
              "No"
            ]
          },
          {
            "key": "s7.ecommerce-or-merchandising",
            "type": "pick",
            "text": "Ecommerce or merchandising",
            "options": [
              "Yes",
              "No"
            ]
          },
          {
            "key": "s7.data-analysis-or-reporting-of-any-kind",
            "type": "pick",
            "text": "Data analysis or reporting of any kind",
            "options": [
              "Yes",
              "No"
            ]
          },
          {
            "key": "s7.working-with-an-outside-agency-or-workin",
            "type": "pick",
            "text": "Working with an outside agency, or working at one",
            "options": [
              "Yes",
              "No"
            ]
          },
          {
            "key": "s7.what-do-you-already-know-about-brady-fro",
            "type": "text",
            "text": "What do you already know about Brady from interviewing here?",
            "hint": "Saves us re-explaining things you've already been told three times."
          }
        ]
      },
      {
        "id": 8,
        "title": "AI tools",
        "questions": [
          {
            "type": "note",
            "text": "Gemini is Brady's sanctioned AI tool. This is just to find out where you are starting."
          },
          {
            "key": "s8.where-are-you-with-ai-tools-today",
            "type": "pick",
            "text": "Where are you with AI tools today?",
            "options": [
              "I use them daily for real work",
              "I've used them for questions and drafting",
              "I've tried them and wasn't convinced",
              "Barely at all"
            ]
          },
          {
            "key": "s8.where-do-you-trust-them-and-where-don-t",
            "type": "text",
            "text": "Where do you trust them, and where don't you?",
            "hint": "The answer we are building toward is \"trust it to draft, never to know a number\"."
          }
        ]
      },
      {
        "id": 9,
        "title": "The two that matter most",
        "questions": [
          {
            "key": "s9.what-are-you-most-looking-forward-to",
            "type": "text",
            "text": "What are you most looking forward to?"
          },
          {
            "key": "s9.what-are-you-most-worried-about",
            "type": "text",
            "text": "What are you most worried about?",
            "hint": "Also in the baseline - answer it in whichever place you prefer."
          },
          {
            "key": "s9.what-would-make-day-90-feel-like-a-win-t",
            "type": "text",
            "text": "What would make day 90 feel like a win to you?",
            "hint": "Not the version in the plan - yours. This is the cheapest moment to add it."
          }
        ]
      }
    ]
  };
}
