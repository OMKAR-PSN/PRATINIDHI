"""
mcc_filter.py — Model Code of Conduct (MCC) Election Compliance Filter
भारत Avatar Platform — India Innovates 2026
"""

import re

# Comprehensive list of banned keywords for election compliance
BANNED_KEYWORDS = [
    # Political party names
    "bjp", "congress", "aap", "tmc", "dmk", "aiadmk", "ncp", "shiv sena",
    "shivsena", "rjd", "jdu", "bsp", "samajwadi", "cpi", "cpim", "jmm",
    "trinamool", "janata dal", "bharatiya janata", "indian national congress",
    "aam aadmi", "rashtriya janata dal", "bahujan samaj",

    # Hindi political terms
    "भाजपा", "कांग्रेस", "आप", "तृणमूल", "भारतीय जनता पार्टी",
    "राष्ट्रवादी कांग्रेस", "शिवसेना", "समाजवादी पार्टी", "बहुजन समाज पार्टी",

    # Marathi political terms
    "भाजप", "काँग्रेस", "शिवसेना", "राष्ट्रवादी",

    # Tamil political terms
    "திமுக", "அதிமுக", "பாஜக", "காங்கிரஸ்",

    # Bengali political terms
    "তৃণমূল", "বিজেপি", "কংগ্রেস",

    # Vote solicitation (English)
    "vote for", "vote against", "elect", "election campaign",
    "campaign for", "support the party", "party candidate",
    "political rally", "vote bank",

    # Vote solicitation (Hindi)
    "vote karein", "vote do", "vote karo", "chunav", "chunaav",
    "matdan", "mat daan", "चुनाव प्रचार", "वोट दो", "वोट करें",
    "मतदान करें", "प्रचार", "चुनावी",

    # Vote solicitation (Marathi)
    "मतदान करा", "निवडणूक प्रचार",

    # Caste/community appeals
    "jati vote", "caste vote", "community vote",
    "जाति वोट", "जातिगत", "सांप्रदायिक",

    # Religious appeals
    "dharma ke naam pe vote", "hindu vote", "muslim vote",
    "धर्म के नाम पे", "धार्मिक वोट",

    # Leader-specific campaigning
    "modi sarkar", "rahul gandhi", "kejriwal", "mamata",
    "मोदी सरकार", "राहुल गांधी", "केजरीवाल", "ममता",

    # Derogatory/divisive
    "anti-national", "tukde tukde", "urban naxal",
    "देशद्रोही", "टुकड़े टुकड़े",

    # Promises for votes
    "free if elected", "muft", "मुफ्त अगर जीते",
    "promise if voted", "जीतने पर देंगे",
]


def check_mcc_compliance(text: str) -> dict:
    """
    Check if the given text complies with Model Code of Conduct (MCC).

    Args:
        text: The text to check for MCC violations.

    Returns:
        Dictionary with:
        - compliant (bool): True if text passes MCC filter
        - violations (list): List of matched violation terms
        - reason (str): Human-readable reason if non-compliant
    """
    if not text or not text.strip():
        return {
            "compliant": True,
            "violations": [],
            "reason": ""
        }

    text_lower = text.lower().strip()
    violations = []

    for keyword in BANNED_KEYWORDS:
        # Use word boundary matching for English terms, direct match for non-Latin
        keyword_lower = keyword.lower()
        if keyword_lower in text_lower:
            violations.append(keyword)

    if violations:
        unique_violations = list(set(violations))
        return {
            "compliant": False,
            "violations": unique_violations,
            "reason": (
                f"Content flagged for MCC violation. "
                f"Detected terms: {', '.join(unique_violations)}. "
                f"Political content, vote solicitation, caste/religious appeals, "
                f"and party-specific messaging are not permitted under the "
                f"Election Commission's Model Code of Conduct."
            )
        }

    return {
        "compliant": True,
        "violations": [],
        "reason": ""
    }
