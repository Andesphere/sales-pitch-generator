# Icebreaker JSON Schema

This document defines the JSON structure for saved icebreaker pitch files.

## File Location & Naming

- **Folder:** `pitches/` (in project root)
- **Filename format:** `{company-slug}_{YYYY-MM-DDTHH-MM-SSZ}.json` (full timestamp)
- **Slug rules:** lowercase, replace spaces with hyphens, remove special characters
- **Timestamp format:** Use hyphens instead of colons in time (colons are invalid in filenames on some systems)
- **Example:** `fairfax-launderette_2026-01-16T14-30-00Z.json`

## Full Schema

```json
{
  "meta": {
    "generatedAt": "2026-01-16T14:30:00Z",
    "sourceUrl": "https://fairfaxlaunderette.co.uk/",
    "customInstructions": "focus on delivery service"
  },
  "business": {
    "name": "Fairfax Launderette",
    "owner": "Gordon",
    "location": "123 Fairfax Drive, Westcliff-on-Sea",
    "industry": "Laundry Services",
    "website": "https://fairfaxlaunderette.co.uk/",
    "isLocal": true
  },
  "services": [
    { "name": "Wash & Fold", "price": "£12/load" },
    { "name": "Dry Cleaning", "price": "From £5" },
    { "name": "Ironing Service", "price": "£3/item" }
  ],
  "operatingHours": {
    "schedule": {
      "monday": "7am-9pm",
      "tuesday": "7am-9pm",
      "wednesday": "7am-9pm",
      "thursday": "7am-9pm",
      "friday": "7am-9pm",
      "saturday": "8am-6pm",
      "sunday": "9am-5pm"
    },
    "staffedHours": "1pm-8pm",
    "gapIdentified": "Open 14 hours but staffed only 7 hours"
  },
  "digitalPresence": {
    "websiteQuality": "Professional, mobile-friendly",
    "contactMethods": ["phone", "contact form", "facebook"],
    "reviewSummary": "4.5 stars on Google, praised for friendly service"
  },
  "painPoints": [
    "Open 14 hours but staffed only 7 hours - customers can't get help",
    "No online booking for services",
    "FAQ questions repeated on reviews"
  ],
  "pitches": [
    {
      "angle": "pain-point",
      "subjectLine": "Quick question about the 1pm-8pm gap",
      "message": "Hi Gordon, I'm based in Westcliff too—noticed Fairfax Launderette is open until 8pm but your attendant finishes at 1pm. Do customers ever get stuck with machine settings or pricing during those afternoon hours? A similar launderette added a QR code assistant—the owner said it's like extra help without the wage bill. Worth a quick chat? Happy to pop by if easier. — Jorge",
      "wordCount": 68
    },
    {
      "angle": "opportunity",
      "subjectLine": "Your 5-mile collection radius",
      "message": "Hi Gordon, I'm based in Westcliff too—your 5-mile free collection radius is a great differentiator for busy families. Are you capturing those enquiries when you're not at the desk? A launderette we work with added a QR code for instant collection bookings—now customers book anytime, even at 10pm. Worth exploring? Happy to pop by if easier. — Jorge",
      "wordCount": 62
    },
    {
      "angle": "social-proof",
      "subjectLine": "What worked for a local laundromat",
      "message": "Hi Gordon, I'm based in Westcliff too—a laundromat we work with, DoBrasil, captured 49% of their enquiries outside business hours. That's 52 conversations in 6 weeks they would have missed. With Fairfax open until 8pm but staffed until 1pm, I wondered if you'd find similar value. Worth a quick chat? Happy to pop by if easier. — Jorge",
      "wordCount": 66
    }
  ],
  "recommendedPitch": {
    "index": 0,
    "reason": "Strong hours gap identified (7 unstaffed hours) makes pain point angle most compelling"
  },
  "outreach": {
    "primaryChannel": "Contact Form",
    "primaryLink": "https://fairfaxlaunderette.co.uk/contact/",
    "recommendedSubjectLine": "Quick question about your 1pm-8pm hours",
    "reasoning": "No direct email visible, contact form is professional",
    "alternatives": [
      { "channel": "Facebook", "link": "https://facebook.com/fairfaxlaunderette", "note": "Active page" },
      { "channel": "Phone", "link": "01702 352181", "note": "For warm follow-up" }
    ]
  },
  "sources": [
    { "page": "Homepage", "url": "https://fairfaxlaunderette.co.uk/", "found": "Company name, services overview" },
    { "page": "Contact", "url": "https://fairfaxlaunderette.co.uk/contact/", "found": "Hours, phone, address" },
    { "page": "About", "url": "https://fairfaxlaunderette.co.uk/about/", "found": "Owner name Gordon" }
  ]
}
```

## Field Reference

### meta (required)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `generatedAt` | string (ISO 8601) | Yes | Full timestamp when the pitch was generated (e.g., `2026-01-16T14:30:00Z`) - must include time, not just date |
| `sourceUrl` | string (URL) | Yes | The original URL analyzed |
| `customInstructions` | string \| null | No | Any custom instructions provided via `--instructions` flag |

### business (required)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Company/business name |
| `owner` | string \| null | No | Owner or contact name if found |
| `location` | string | Yes | Business address |
| `industry` | string | Yes | Detected industry category |
| `website` | string (URL) | Yes | Company website URL |
| `isLocal` | boolean | Yes | Whether the business is in the local area (per CLAUDE.md) |

### services (required)

Array of service objects:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Service name |
| `price` | string \| null | No | Price if found (e.g., "£12/load", "From £5") |

### operatingHours (required)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schedule` | object | Yes | Key-value pairs of day names to hours |
| `staffedHours` | string \| null | No | Hours when staff is present (if different from opening hours) |
| `gapIdentified` | string \| null | No | Description of any staffing/hours gap identified |

### digitalPresence (required)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `websiteQuality` | string | Yes | Assessment of website quality |
| `contactMethods` | array of strings | Yes | Available contact methods |
| `reviewSummary` | string \| null | No | Summary of online reviews if found |

### painPoints (required)

Array of strings describing identified pain points. Each should include specific evidence from the website.

### pitches (required)

Array of 3 pitch objects, each with a different angle:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `angle` | string | Yes | The pitch angle: `"pain-point"`, `"opportunity"`, or `"social-proof"` |
| `subjectLine` | string | Yes | Subject line for this pitch angle |
| `message` | string | Yes | The full icebreaker message text |
| `wordCount` | number | Yes | Word count of the message |

### recommendedPitch (required)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `index` | number | Yes | Index of the recommended pitch (0, 1, or 2) |
| `reason` | string | Yes | Explanation of why this pitch is the best fit for this prospect |

### outreach (required)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `primaryChannel` | string | Yes | Recommended outreach channel (Email, Contact Form, Facebook, LinkedIn, Phone) |
| `primaryLink` | string | Yes | Direct link or contact info for primary channel |
| `recommendedSubjectLine` | string | Yes | Best subject line for the outreach |
| `reasoning` | string | Yes | Why this channel was recommended |
| `alternatives` | array | Yes | Alternative outreach channels |

**alternatives** array items:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `channel` | string | Yes | Channel name |
| `link` | string | Yes | Link or contact info |
| `note` | string | No | Brief note about this channel |

### sources (required)

Array of source objects documenting where information was found:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | string | Yes | Page name (e.g., "Homepage", "Contact") |
| `url` | string (URL) | Yes | Full URL of the page |
| `found` | string | Yes | What information was found on this page |

## Handling Missing Data

- Use `null` for optional fields when data is not available
- For required fields, provide best effort values:
  - `owner`: Use `null` if not found
  - `services`: Include at least one service if business type is clear
  - `operatingHours.schedule`: Use `"Not found"` for unknown hours
  - `painPoints`: Always include at least one generic chatbot opportunity if specific ones aren't found

## Example with Minimal Data

```json
{
  "meta": {
    "generatedAt": "2026-01-16T14:30:00Z",
    "sourceUrl": "https://example.com/",
    "customInstructions": null
  },
  "business": {
    "name": "Example Business",
    "owner": null,
    "location": "London, UK",
    "industry": "General Services",
    "website": "https://example.com/",
    "isLocal": false
  },
  "services": [
    { "name": "General Services", "price": null }
  ],
  "operatingHours": {
    "schedule": {
      "monday": "Not found"
    },
    "staffedHours": null,
    "gapIdentified": null
  },
  "digitalPresence": {
    "websiteQuality": "Basic website",
    "contactMethods": ["contact form"],
    "reviewSummary": null
  },
  "painPoints": [
    "No 24/7 online support available"
  ],
  "pitches": [
    {
      "angle": "pain-point",
      "subjectLine": "Question about after-hours support",
      "message": "Hi, I noticed your business doesn't have 24/7 support coverage. Do customers ever reach out when you're closed? A chatbot could handle those enquiries instantly. Worth exploring?",
      "wordCount": 32
    },
    {
      "angle": "opportunity",
      "subjectLine": "Quick idea for your website",
      "message": "Hi, I noticed your website could capture more leads with instant responses. Businesses like yours often miss enquiries that come in after hours. A quick assistant could change that. Worth a chat?",
      "wordCount": 36
    },
    {
      "angle": "social-proof",
      "subjectLine": "What's working for similar businesses",
      "message": "Hi, businesses similar to yours are using AI assistants to handle routine questions instantly. It frees up their time while ensuring no enquiry goes unanswered. Worth exploring?",
      "wordCount": 29
    }
  ],
  "recommendedPitch": {
    "index": 0,
    "reason": "Limited information available, but pain point angle addresses the most universal chatbot value proposition"
  },
  "outreach": {
    "primaryChannel": "Contact Form",
    "primaryLink": "https://example.com/contact/",
    "recommendedSubjectLine": "Question about after-hours support",
    "reasoning": "Only contact method available",
    "alternatives": []
  },
  "sources": [
    { "page": "Homepage", "url": "https://example.com/", "found": "Company name, basic info" }
  ]
}
```
