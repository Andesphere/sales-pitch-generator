# Project Context

## Company Information

**Company:** Andesphere
**Product:** Andy (AI agent platform) — andypartner.com
**Founder:** Jorge Mena, Co-founder
**Location:** Westcliff-on-Sea, Essex, UK

## Usage Notes for Icebreaker Skill

When generating icebreakers, check if the target business is in or near Westcliff-on-Sea (or broader Essex/South Essex area). If so, leverage the local angle for stronger personalization:

**Local areas to check for:**
- Westcliff-on-Sea
- Southend-on-Sea
- Leigh-on-Sea
- Thorpe Bay
- Shoeburyness
- Rochford
- Rayleigh
- Benfleet
- Canvey Island
- Hadleigh
- Basildon
- Grays
- Tilbury

**If local, add to the pitch:**
- Open with local angle: "I'm based in Westcliff too..." / "As a fellow South Essex business..."
- Include founder name + title mid-message (NOT as opening): "I'm Jorge, co-founder of Andy — we help local businesses..."
- End with: "Happy to pop by if easier."
- Sign off with just "Jorge" (first name only, keeps it personal)

**Why this works (research-backed):**
- Proximity psychology: "neighbor before business owner" activates trust
- Founder-to-owner: creates peer credibility (business owners trust other business owners)
- Combined effect: Local + Founder = strongest trust signal for SMB outreach

**If not local:**
- Skip the local angle entirely
- Don't fake proximity
- Focus on other personalization methods

---

## Convex HTTP API

Base URL: `https://flippant-dodo-971.convex.site`

All endpoints return JSON responses with this structure:
```json
{
  "success": true|false,
  "message": "Human-readable message",
  "data": { ... } | null
}
```

### POST /api/prospect
Create a search record and its prospects. Handles duplicate URL detection automatically.

**Request:**
```json
{
  "search": {
    "industry": "launderette",
    "location": "Southend",
    "count": 3,
    "localOnly": false,
    "totalFound": 18,
    "afterDeduplication": 8,
    "localCount": 5,
    "prospectsReturned": 3,
    "searchQueries": ["launderette Southend UK", "..."]
  },
  "prospects": [
    {
      "name": "Jean's Launderette",
      "url": "https://jeanslaundrette.co.uk/",
      "city": "Southend-on-Sea",
      "locationText": "Southend-on-Sea, Essex",
      "isLocal": true,
      "confidence": "high",
      "sources": ["tavily", "exa"],
      "notes": null
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Created 1 search and 3 prospects (1 duplicate skipped)",
  "data": {
    "searchId": "jd73ntf...",
    "prospectsCreated": 3,
    "duplicatesSkipped": 1,
    "duplicateUrls": ["https://already-exists.com/"]
  }
}
```

### POST /api/pitch
Create a pitch for a business. Auto-links to existing prospect if URL matches.

**Request body fields:**
- `companyName` (required): string
- `website` (required): string
- `industry` (required): string
- `pitchOptions` (required): array of pitch objects
- `owner`: string or omit (do NOT send `null`)
- `isLocal`: boolean (default: false)
- `location`: `{ address?, city?, area? }`
- `contact`: `{ phone?, mobile?, email?, form?, facebook? }`
- `services`: array of `{ name, price? }`
- `painPoints`: array of strings
- `recommendedPitch`: number (index into pitchOptions)
- `recommendedPitchReason`: string
- `recommendedChannel`: string
- `outreach`: `{ primaryChannel, primaryLink, recommendedSubjectLine, reasoning, alternatives[] }`
- `sources`: array of `{ page, url, found }`
- `customInstructions`: string or omit (do NOT send `null`)

**Note:** For optional fields, omit them entirely rather than sending `null`. Convex validators accept `undefined` but reject `null`.

**Response (201):**
```json
{
  "success": true,
  "message": "Pitch created for Jean's Launderette. Linked to existing prospect (status updated to 'pitched').",
  "data": {
    "pitchId": "j97abc...",
    "prospectId": "j97xyz...",
    "linkedToExistingProspect": true
  }
}
```

**Duplicate Response (409):**
```json
{
  "success": false,
  "message": "A pitch already exists for this website (https://jeanslaundrette.co.uk/). Use GET /api/pitches?website=... to retrieve it.",
  "data": { "existingPitchId": "j97abc..." }
}
```

### GET /api/prospects
Query prospects with optional filters.

**Query params:** `?status=new&isLocal=true&limit=10`

**Response (200):**
```json
{
  "success": true,
  "message": "Found 5 prospects",
  "data": { "prospects": [...], "total": 5 }
}
```

### GET /api/pitches
Query pitches with optional filters.

**Query params:** `?industry=Laundry&isLocal=true&website=https://...&limit=10`

### GET /api/stats
Pipeline statistics.

**Response (200):**
```json
{
  "success": true,
  "message": "Pipeline stats retrieved",
  "data": {
    "prospects": { "new": 5, "pitched": 2, "contacted": 0, "responded": 0, "converted": 0, "total": 7 },
    "pitches": { "total": 2, "local": 2, "nonLocal": 0, "industries": ["Laundry Services"] }
  }
}
```
