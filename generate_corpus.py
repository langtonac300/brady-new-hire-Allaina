import json
import re

# We will construct python dictionaries for all 6 companies and validate them using strict checks.

companies_data = []

# ==========================================
# 1. COMMERCIAL FIRE PROTECTION
# ==========================================
c1_queries = [
    # HIGH INTENT (22)
    {"q": "commercial fire suppression system installation", "intent": "high", "baseImp": 85, "baseCtr": 0.08, "baseCvr": 0.06, "value": 15000, "tags": ["suppression", "install", "commercial"]},
    {"q": "commercial fire alarm system installer near me", "intent": "high", "baseImp": 65, "baseCtr": 0.09, "baseCvr": 0.07, "value": 12000, "tags": ["alarm", "installer", "commercial"]},
    {"q": "industrial sprinkler system contractor quote", "intent": "high", "baseImp": 45, "baseCtr": 0.07, "baseCvr": 0.05, "value": 18000, "tags": ["sprinkler", "contractor", "industrial"]},
    {"q": "warehouse fire protection company", "intent": "high", "baseImp": 70, "baseCtr": 0.08, "baseCvr": 0.06, "value": 16000, "tags": ["fire", "protection", "warehouse"]},
    {"q": "commercial kitchen fire suppression system cost", "intent": "high", "baseImp": 90, "baseCtr": 0.09, "baseCvr": 0.05, "value": 10000, "tags": ["kitchen", "suppression", "cost"]},
    {"q": "annual commercial fire sprinkler inspection service", "intent": "high", "baseImp": 55, "baseCtr": 0.07, "baseCvr": 0.08, "value": 8000, "tags": ["sprinkler", "inspection", "commercial"]},
    {"q": "hire commercial fire safety audit firm", "intent": "high", "baseImp": 30, "baseCtr": 0.06, "baseCvr": 0.05, "value": 12000, "tags": ["safety", "audit", "commercial"]},
    {"q": "clean agent fire suppression system install", "intent": "high", "baseImp": 40, "baseCtr": 0.08, "baseCvr": 0.06, "value": 20000, "tags": ["clean agent", "suppression", "install"]},
    {"q": "data center fire protection contractor", "intent": "high", "baseImp": 35, "baseCtr": 0.07, "baseCvr": 0.06, "value": 22000, "tags": ["data center", "fire", "contractor"]},
    {"q": "commercial fire pump testing company", "intent": "high", "baseImp": 25, "baseCtr": 0.06, "baseCvr": 0.07, "value": 7500, "tags": ["fire pump", "testing", "commercial"]},
    {"q": "hospital fire alarm system installation", "intent": "high", "baseImp": 30, "baseCtr": 0.07, "baseCvr": 0.05, "value": 25000, "tags": ["alarm", "hospital", "installation"]},
    {"q": "facility fire safety compliance inspection pricing", "intent": "high", "baseImp": 40, "baseCtr": 0.08, "baseCvr": 0.06, "value": 9500, "tags": ["facility", "compliance", "inspection"]},
    {"q": "emergency commercial fire line repair contractor", "intent": "high", "baseImp": 20, "baseCtr": 0.10, "baseCvr": 0.08, "value": 11000, "tags": ["fire line", "repair", "emergency"]},
    {"q": "co2 fire suppression system commercial installer", "intent": "high", "baseImp": 25, "baseCtr": 0.07, "baseCvr": 0.05, "value": 17000, "tags": ["co2", "suppression", "installer"]},
    {"q": "commercial fire extinguisher refill contract", "intent": "high", "baseImp": 60, "baseCtr": 0.08, "baseCvr": 0.07, "value": 5000, "tags": ["extinguisher", "refill", "contract"]},
    {"q": "factory fire protection system retrofitting", "intent": "high", "baseImp": 20, "baseCtr": 0.06, "baseCvr": 0.04, "value": 24000, "tags": ["factory", "protection", "retrofitting"]},
    {"q": "commercial backflow preventer fire sprinkler inspection", "intent": "high", "baseImp": 35, "baseCtr": 0.07, "baseCvr": 0.06, "value": 6000, "tags": ["backflow", "sprinkler", "inspection"]},
    {"q": "office building fire safety audit service", "intent": "high", "baseImp": 45, "baseCtr": 0.07, "baseCvr": 0.06, "value": 8500, "tags": ["office", "fire safety", "audit"]},
    {"q": "nfpa 72 compliant fire alarm installation company", "intent": "high", "baseImp": 30, "baseCtr": 0.08, "baseCvr": 0.06, "value": 14000, "tags": ["nfpa 72", "alarm", "installation"]},
    {"q": "commercial foam fire suppression system quote", "intent": "high", "baseImp": 25, "baseCtr": 0.07, "baseCvr": 0.05, "value": 19000, "tags": ["foam", "suppression", "quote"]},
    {"q": "industrial fire riser inspection services", "intent": "high", "baseImp": 20, "baseCtr": 0.06, "baseCvr": 0.07, "value": 7000, "tags": ["riser", "inspection", "industrial"]},
    {"q": "commercial building fire monitoring service contract", "intent": "high", "baseImp": 50, "baseCtr": 0.08, "baseCvr": 0.07, "value": 9000, "tags": ["monitoring", "contract", "commercial"]},

    # RESEARCH INTENT (17)
    {"q": "types of commercial fire suppression systems", "intent": "research", "baseImp": 110, "baseCtr": 0.04, "baseCvr": 0.015, "value": 15000, "tags": ["types", "suppression", "commercial"]},
    {"q": "how often commercial fire sprinklers need inspection", "intent": "research", "baseImp": 95, "baseCtr": 0.05, "baseCvr": 0.01, "value": 8000, "tags": ["inspection", "sprinklers", "commercial"]},
    {"q": "clean agent vs co2 fire suppression comparison", "intent": "research", "baseImp": 60, "baseCtr": 0.04, "baseCvr": 0.01, "value": 18000, "tags": ["clean agent", "co2", "comparison"]},
    {"q": "nfpa 25 inspection requirements summary", "intent": "research", "baseImp": 80, "baseCtr": 0.05, "baseCvr": 0.01, "value": 9000, "tags": ["nfpa 25", "requirements", "inspection"]},
    {"q": "deluge sprinkler system vs preaction sprinkler system", "intent": "research", "baseImp": 40, "baseCtr": 0.04, "baseCvr": 0.015, "value": 16000, "tags": ["deluge", "preaction", "sprinkler"]},
    {"q": "commercial fire alarm installation checklist", "intent": "research", "baseImp": 75, "baseCtr": 0.05, "baseCvr": 0.01, "value": 12000, "tags": ["alarm", "installation", "checklist"]},
    {"q": "warehouse fire suppression code guidelines", "intent": "research", "baseImp": 50, "baseCtr": 0.04, "baseCvr": 0.015, "value": 15000, "tags": ["warehouse", "guidelines", "suppression"]},
    {"q": "how does an industrial fire pump work", "intent": "research", "baseImp": 65, "baseCtr": 0.03, "baseCvr": 0.005, "value": 7500, "tags": ["fire pump", "industrial", "how it works"]},
    {"q": "commercial kitchen hood fire system components", "intent": "research", "baseImp": 70, "baseCtr": 0.04, "baseCvr": 0.01, "value": 10000, "tags": ["kitchen", "hood", "components"]},
    {"q": "fm200 replacement alternatives commercial", "intent": "research", "baseImp": 45, "baseCtr": 0.04, "baseCvr": 0.015, "value": 20000, "tags": ["fm200", "alternatives", "commercial"]},
    {"q": "fire sprinkler inspection cost per square foot", "intent": "research", "baseImp": 85, "baseCtr": 0.05, "baseCvr": 0.02, "value": 8000, "tags": ["inspection", "cost", "square foot"]},
    {"q": "server room fire suppression best practices", "intent": "research", "baseImp": 55, "baseCtr": 0.04, "baseCvr": 0.015, "value": 22000, "tags": ["server room", "suppression", "best practices"]},
    {"q": "when to replace commercial fire alarm panel", "intent": "research", "baseImp": 40, "baseCtr": 0.04, "baseCvr": 0.01, "value": 11000, "tags": ["alarm panel", "replace", "commercial"]},
    {"q": "annual vs quarterly fire sprinkler inspections", "intent": "research", "baseImp": 35, "baseCtr": 0.04, "baseCvr": 0.01, "value": 8000, "tags": ["annual", "quarterly", "inspections"]},
    {"q": "osha commercial fire safety compliance standard", "intent": "research", "baseImp": 90, "baseCtr": 0.03, "baseCvr": 0.005, "value": 9500, "tags": ["osha", "compliance", "standard"]},
    {"q": "what is preaction fire suppression system", "intent": "research", "baseImp": 50, "baseCtr": 0.03, "baseCvr": 0.005, "value": 16000, "tags": ["preaction", "suppression", "definition"]},
    {"q": "commercial fire protection system life expectancy", "intent": "research", "baseImp": 30, "baseCtr": 0.04, "baseCvr": 0.01, "value": 14000, "tags": ["life expectancy", "protection", "commercial"]},

    # GRAY INTENT (10)
    {"q": "fire safety training course for employees", "intent": "gray", "baseImp": 80, "baseCtr": 0.03, "baseCvr": 0.002, "value": 500, "tags": ["training", "course", "employees"]},
    {"q": "fire extinguisher inspection log template pdf", "intent": "gray", "baseImp": 70, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["log", "template", "pdf"]},
    {"q": "how to become certified fire alarm technician", "intent": "gray", "baseImp": 60, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["certified", "technician", "career"]},
    {"q": "fire warden responsibility list office building", "intent": "gray", "baseImp": 45, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["fire warden", "office", "list"]},
    {"q": "nfpa code book free download pdf", "intent": "gray", "baseImp": 90, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["nfpa", "code book", "pdf"]},
    {"q": "commercial fire drill procedure document", "intent": "gray", "baseImp": 50, "baseCtr": 0.03, "baseCvr": 0.001, "value": 200, "tags": ["fire drill", "procedure", "document"]},
    {"q": "osha workplace evacuation plan template", "intent": "gray", "baseImp": 65, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["osha", "evacuation", "template"]},
    {"q": "fire marshal inspection checklist download", "intent": "gray", "baseImp": 55, "baseCtr": 0.04, "baseCvr": 0.005, "value": 1000, "tags": ["fire marshal", "checklist", "download"]},
    {"q": "nicet fire alarm certification study guide", "intent": "gray", "baseImp": 40, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["nicet", "certification", "study guide"]},
    {"q": "building code fire rating requirements table", "intent": "gray", "baseImp": 35, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["building code", "fire rating", "table"]},

    # COMPETITOR INTENT (7)
    {"q": "vanguard fire protection competitors", "intent": "competitor", "baseImp": 40, "baseCtr": 0.05, "baseCvr": 0.02, "value": 12000, "tags": ["vanguard", "competitors", "fire"]},
    {"q": "pyroshield suppression system pricing", "intent": "competitor", "baseImp": 35, "baseCtr": 0.06, "baseCvr": 0.025, "value": 14000, "tags": ["pyroshield", "suppression", "pricing"]},
    {"q": "firetech corp commercial service", "intent": "competitor", "baseImp": 30, "baseCtr": 0.05, "baseCvr": 0.02, "value": 11000, "tags": ["firetech", "commercial", "service"]},
    {"q": "omni fire safety vs apex fire solutions", "intent": "competitor", "baseImp": 25, "baseCtr": 0.07, "baseCvr": 0.03, "value": 15000, "tags": ["omni fire", "apex", "comparison"]},
    {"q": "vanguard fire system inspection cost", "intent": "competitor", "baseImp": 30, "baseCtr": 0.05, "baseCvr": 0.02, "value": 8000, "tags": ["vanguard", "inspection", "cost"]},
    {"q": "pyroshield maintenance contracts", "intent": "competitor", "baseImp": 20, "baseCtr": 0.06, "baseCvr": 0.025, "value": 10000, "tags": ["pyroshield", "maintenance", "contracts"]},
    {"q": "firetech corp fire alarm quote", "intent": "competitor", "baseImp": 25, "baseCtr": 0.06, "baseCvr": 0.02, "value": 13000, "tags": ["firetech", "alarm", "quote"]},

    # JOBS INTENT (10)
    {"q": "fire sprinkler installer jobs salary", "intent": "jobs", "baseImp": 120, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["jobs", "salary", "installer"]},
    {"q": "fire alarm technician entry level job openings", "intent": "jobs", "baseImp": 90, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["technician", "job openings", "entry level"]},
    {"q": "fire protection engineer career pay", "intent": "jobs", "baseImp": 70, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["engineer", "career", "pay"]},
    {"q": "fire sprinkler apprenticeship hiring near me", "intent": "jobs", "baseImp": 85, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["apprenticeship", "hiring", "sprinkler"]},
    {"q": "fire safety inspector hourly wage", "intent": "jobs", "baseImp": 65, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["inspector", "hourly wage", "fire safety"]},
    {"q": "fire alarm installer resume template", "intent": "jobs", "baseImp": 40, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["installer", "resume", "template"]},
    {"q": "apex fire solutions employment reviews glassdoor", "intent": "jobs", "baseImp": 50, "baseCtr": 0.04, "baseCvr": 0.0, "value": 0, "tags": ["apex", "employment", "reviews"]},
    {"q": "fire suppression technician job description", "intent": "jobs", "baseImp": 55, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["technician", "job description", "suppression"]},
    {"q": "commercial fire inspector certification careers", "intent": "jobs", "baseImp": 35, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["inspector", "certification", "careers"]},
    {"q": "fire protection intern positions summer", "intent": "jobs", "baseImp": 30, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["intern", "positions", "fire protection"]},

    # RESIDENTIAL INTENT (10)
    {"q": "home fire extinguisher for kitchen", "intent": "residential", "baseImp": 140, "baseCtr": 0.04, "baseCvr": 0.0, "value": 0, "tags": ["home", "extinguisher", "kitchen"]},
    {"q": "residential fire alarm system cost for house", "intent": "residential", "baseImp": 130, "baseCtr": 0.04, "baseCvr": 0.0, "value": 0, "tags": ["residential", "house", "alarm"]},
    {"q": "diy smoke detector installation home", "intent": "residential", "baseImp": 110, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["diy", "smoke detector", "home"]},
    {"q": "apartment fire sprinkler leaking help", "intent": "residential", "baseImp": 80, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["apartment", "sprinkler", "leaking"]},
    {"q": "home fire safety ladder 2 story", "intent": "residential", "baseImp": 95, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["home", "safety ladder", "2 story"]},
    {"q": "residential stove fire suppression kit amazon", "intent": "residential", "baseImp": 75, "baseCtr": 0.04, "baseCvr": 0.0, "value": 0, "tags": ["residential", "stove", "suppression"]},
    {"q": "best fire alarm for single family home", "intent": "residential", "baseImp": 100, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["home", "single family", "fire alarm"]},
    {"q": "residential fire sprinkler installation cost per sq ft house", "intent": "residential", "baseImp": 85, "baseCtr": 0.04, "baseCvr": 0.0, "value": 0, "tags": ["residential", "house", "sprinkler"]},
    {"q": "fireplace safety screen for living room", "intent": "residential", "baseImp": 90, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["fireplace", "living room", "safety screen"]},
    {"q": "home basement fire extinguisher placement", "intent": "residential", "baseImp": 60, "baseCtr": 0.03, "baseCvr": 0.0, "value": 0, "tags": ["home", "basement", "extinguisher"]},

    # IRRELEVANT INTENT (9)
    {"q": "fire truck toys for kids bulk", "intent": "irrelevant", "baseImp": 150, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["fire truck", "toys", "kids"]},
    {"q": "outdoor fire pit kit home depot", "intent": "irrelevant", "baseImp": 160, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["fire pit", "outdoor", "home depot"]},
    {"q": "campfire safety tips for camping", "intent": "irrelevant", "baseImp": 110, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["campfire", "camping", "safety"]},
    {"q": "fire emblem game walkthrough guide", "intent": "irrelevant", "baseImp": 130, "baseCtr": 0.01, "baseCvr": 0.0, "value": 0, "tags": ["fire emblem", "game", "walkthrough"]},
    {"q": "chicago fire tv show full episodes online", "intent": "irrelevant", "baseImp": 170, "baseCtr": 0.01, "baseCvr": 0.0, "value": 0, "tags": ["chicago fire", "tv show", "episodes"]},
    {"q": "fire breathing dragon drawing easy", "intent": "irrelevant", "baseImp": 95, "baseCtr": 0.01, "baseCvr": 0.0, "value": 0, "tags": ["dragon", "drawing", "fire"]},
    {"q": "amazon fire tv stick remote replacement", "intent": "irrelevant", "baseImp": 180, "baseCtr": 0.01, "baseCvr": 0.0, "value": 0, "tags": ["fire tv", "stick", "remote"]},
    {"q": "fire elemental magic spells DnD", "intent": "irrelevant", "baseImp": 75, "baseCtr": 0.01, "baseCvr": 0.0, "value": 0, "tags": ["fire elemental", "dnd", "spells"]},
    {"q": "fire hot sauce recipe ghost pepper", "intent": "irrelevant", "baseImp": 85, "baseCtr": 0.02, "baseCvr": 0.0, "value": 0, "tags": ["hot sauce", "ghost pepper", "fire"]}
]

c1_negatives = ["jobs", "job", "salary", "wage", "career", "careers", "intern", "hiring", "employment", "home", "house", "diy", "apartment", "fireplace", "living", "toys", "toy", "pit", "campfire", "emblem", "show", "dragon", "stick", "sauce"]

c1_gray_calls = [
    {"q": "fire safety training course for employees", "recommendation": "block", "why": "Targeting safety training brings low-intent employee queries rather than B2B facility buyers needing system installs/audits."},
    {"q": "fire extinguisher inspection log template pdf", "recommendation": "block", "why": "Searchers seeking free templates have zero intent to outsource commercial inspection services."},
    {"q": "how to become certified fire alarm technician", "recommendation": "block", "why": "Career and certification queries reflect student/technician intent rather than commercial procurement."},
    {"q": "fire warden responsibility list office building", "recommendation": "block", "why": "Informational query by internal office staff with no commercial purchasing budget or intent."},
    {"q": "nfpa code book free download pdf", "recommendation": "block", "why": "Free document download seekers rarely convert into paid engineering or compliance audit contracts."},
    {"q": "commercial fire drill procedure document", "recommendation": "keep", "why": "Operations managers creating fire drill procedures may need comprehensive commercial fire safety audits."},
    {"q": "osha workplace evacuation plan template", "recommendation": "block", "why": "Searches for free compliance templates yield near-zero conversion rate for enterprise safety contracts."},
    {"q": "fire marshal inspection checklist download", "recommendation": "keep", "why": "Building managers prepping for marshal inspections frequently hire emergency audit & inspection contractors if gaps are found."},
    {"q": "nicet fire alarm certification study guide", "recommendation": "block", "why": "Study guide searches indicate student or technician certification prep, not commercial system buyers."},
    {"q": "building code fire rating requirements table", "recommendation": "keep", "why": "Architects and general contractors checking fire code ratings often hire fire protection sub-contractors for system design."}
]

c1_defects = [
    {"type": "over-broad-keyword", "detail": "Broad match keyword 'fire protection' capturing consumer fire pit and TV show queries.", "teaches": "Shows how broad match without tight negative lists bleeds budget into irrelevant consumer traffic."},
    {"type": "conversion-value-misconfiguration", "detail": "Commercial installation campaign conversion value hardcoded to $1 instead of estimated deal value of $15,000.", "teaches": "Demonstrates how incorrect value tracking ruins Smart Bidding optimization and ROAS calculations."},
    {"type": "missing-waste-negative", "detail": "Campaign lacks 'jobs' and 'salary' exact negatives while running broad match installer terms.", "teaches": "Illustrates how job-seeker clicks waste ad spend on commercial recruitment intent."}
]

companies_data.append({
    "company": "Apex Fire Solutions",
    "vertical": "Commercial Fire Protection",
    "brief": "Apex Fire Solutions provides enterprise commercial fire protection services across the Midwest, specializing in fire suppression system installations, annual safety inspections, and local code compliance audits. Serving commercial real estate owners, manufacturing plants, and hospital facilities, Apex ensures 24/7 emergency response and certified regulatory adherence.",
    "landingPageBrief": {
        "heroPromise": "Turnkey Commercial Fire Suppression & Inspection Services for Code-Compliant Facilities",
        "services": [
            "Commercial Fire Suppression System Installation",
            "Annual NFPA Sprinkler & Alarm Inspections",
            "Facility Safety Code Compliance Audits",
            "24/7 Emergency Fire Line & Alarm Repair"
        ],
        "targetBuyer": "Facility Directors, Operations Managers, and Commercial Property Owners"
    },
    "queries": c1_queries,
    "answerKey": {
        "negativeStarterList": c1_negatives,
        "grayZoneCalls": c1_gray_calls,
        "seededDefects": c1_defects
    }
})

print("C1 processed successfully")
