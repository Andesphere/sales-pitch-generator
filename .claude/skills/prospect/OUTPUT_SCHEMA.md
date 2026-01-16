# Prospect Output Schema

This document defines the JSON structure for saved prospect files.

## File Location & Naming

- **Folder:** `prospects/` (in project root)
- **Filename format:** `{industry}_{location}_{YYYY-MM-DDTHH-MM-SSZ}.json`
- **Slug rules:** lowercase, replace spaces with hyphens, remove special characters
- **Timestamp format:** Use hyphens instead of colons in time (cross-platform compatibility)
- **Example:** `launderette_southend-on-sea_2026-01-16T14-30-00Z.json`

## Full Schema

```json
{
  "meta": {
    "generatedAt": "2026-01-16T14:30:00Z",
    "query": {
      "industry": "launderette",
      "location": "Southend-on-Sea",
      "count": 10,
      "localOnly": false
    },
    "results": {
      "totalFound": 18,
      "afterDeduplication": 12,
      "localCount": 4,
      "returned": 10
    },
    "searchQueries": [
      "launderette Southend-on-Sea",
      "launderette near Southend-on-Sea UK",
      "launderette Southend-on-Sea site:yell.com"
    ]
  },
  "prospects": [
    {
      "rank": 1,
      "name": "Fairfax Launderette",
      "url": "https://fairfaxlaunderette.co.uk/",
      "location": {
        "text": "123 Fairfax Drive, Westcliff-on-Sea, Essex",
        "city": "Westcliff-on-Sea",
        "isLocal": true
      },
      "confidence": "high",
      "sources": ["tavily", "exa"],
      "notes": null
    },
    {
      "rank": 2,
      "name": "Southend Laundry Services",
      "url": "https://southendlaundry.co.uk/",
      "location": {
        "text": "High Street, Southend-on-Sea",
        "city": "Southend-on-Sea",
        "isLocal": true
      },
      "confidence": "high",
      "sources": ["tavily"],
      "notes": null
    },
    {
      "rank": 3,
      "name": "Essex Dry Cleaners",
      "url": "https://www.yell.com/biz/essex-dry-cleaners/",
      "location": {
        "text": "Basildon, Essex",
        "city": "Basildon",
        "isLocal": true
      },
      "confidence": "medium",
      "sources": ["tavily"],
      "notes": "Directory listing only - no direct website found"
    }
  ]
}
```

## Field Reference

### meta (required)

Top-level metadata about the search.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `generatedAt` | string (ISO 8601) | Yes | Full timestamp when prospects were generated |
| `query` | object | Yes | The search parameters used |
| `results` | object | Yes | Summary statistics about the search |
| `searchQueries` | array of strings | Yes | The actual search queries executed |

#### meta.query

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `industry` | string | Yes | The industry/business type searched |
| `location` | string | Yes | The location searched |
| `count` | number | Yes | Requested number of results |
| `localOnly` | boolean | Yes | Whether --local-only flag was used |

#### meta.results

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `totalFound` | number | Yes | Total raw results from all searches |
| `afterDeduplication` | number | Yes | Results after removing duplicates |
| `localCount` | number | Yes | Number of results in local areas |
| `returned` | number | Yes | Final number of prospects returned |

### prospects (required)

Array of prospect objects, ordered by rank.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rank` | number | Yes | Position in the results (1-indexed) |
| `name` | string | Yes | Business name |
| `url` | string (URL) | Yes | Business website URL |
| `location` | object | Yes | Location information |
| `confidence` | string | Yes | Confidence level: `"high"`, `"medium"`, or `"low"` |
| `sources` | array of strings | Yes | Which search tools found this result |
| `notes` | string \| null | No | Any notes about this prospect |

#### prospects[].location

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | Full location text as found |
| `city` | string \| null | No | Extracted city name |
| `isLocal` | boolean | Yes | Whether this is in a local area (per CLAUDE.md) |

## Confidence Levels

| Level | Criteria |
|-------|----------|
| `"high"` | Has direct business website + business name + location from reliable source |
| `"medium"` | Has 2 of 3: website, name, location; OR only directory listing |
| `"low"` | Missing key data or uncertain match |

## Source Values

Valid values for the `sources` array:

- `"tavily"` - Found via Tavily search
- `"exa"` - Found via Exa search
- `"websearch"` - Found via WebSearch fallback

## Example: Minimal Result

When limited data is available:

```json
{
  "meta": {
    "generatedAt": "2026-01-16T14:30:00Z",
    "query": {
      "industry": "launderette",
      "location": "Small Town",
      "count": 10,
      "localOnly": false
    },
    "results": {
      "totalFound": 3,
      "afterDeduplication": 2,
      "localCount": 0,
      "returned": 2
    },
    "searchQueries": [
      "launderette Small Town",
      "launderette near Small Town UK"
    ]
  },
  "prospects": [
    {
      "rank": 1,
      "name": "Town Launderette",
      "url": "https://www.yell.com/biz/town-launderette/",
      "location": {
        "text": "Small Town",
        "city": "Small Town",
        "isLocal": false
      },
      "confidence": "low",
      "sources": ["tavily"],
      "notes": "Directory listing only"
    }
  ]
}
```

## Example: Local-Only Filter

When `--local-only` flag is used:

```json
{
  "meta": {
    "generatedAt": "2026-01-16T14:30:00Z",
    "query": {
      "industry": "hair salon",
      "location": "Essex",
      "count": 10,
      "localOnly": true
    },
    "results": {
      "totalFound": 25,
      "afterDeduplication": 18,
      "localCount": 6,
      "returned": 6
    },
    "searchQueries": [
      "hair salon Essex",
      "hair salon Southend-on-Sea",
      "hair salon Westcliff-on-Sea"
    ]
  },
  "prospects": [
    {
      "rank": 1,
      "name": "Westcliff Hair Studio",
      "url": "https://westcliffhairstudio.co.uk/",
      "location": {
        "text": "Westcliff-on-Sea, Essex",
        "city": "Westcliff-on-Sea",
        "isLocal": true
      },
      "confidence": "high",
      "sources": ["exa", "tavily"],
      "notes": null
    }
  ]
}
```

## Integration with Icebreaker

The prospect output is designed to feed directly into the icebreaker skill:

```bash
# Generate prospects
/prospect launderette --location "Southend-on-Sea" --count 5

# Use first prospect URL with icebreaker
/icebreaker https://fairfaxlaunderette.co.uk/

# Or read the JSON file for batch processing
# prospects/launderette_southend-on-sea_2026-01-16T14-30-00Z.json
```

## Handling Edge Cases

### No Results Found

```json
{
  "meta": {
    "generatedAt": "2026-01-16T14:30:00Z",
    "query": {
      "industry": "obscure-business",
      "location": "Tiny Village",
      "count": 10,
      "localOnly": false
    },
    "results": {
      "totalFound": 0,
      "afterDeduplication": 0,
      "localCount": 0,
      "returned": 0
    },
    "searchQueries": [
      "obscure-business Tiny Village"
    ]
  },
  "prospects": []
}
```

### Only Directory Listings

When no direct websites are found, still include directory URLs but note the limitation:

```json
{
  "prospects": [
    {
      "rank": 1,
      "name": "Example Business",
      "url": "https://www.yell.com/biz/example-business/",
      "location": {
        "text": "Southend-on-Sea",
        "city": "Southend-on-Sea",
        "isLocal": true
      },
      "confidence": "medium",
      "sources": ["tavily"],
      "notes": "Directory listing - direct website not found. Icebreaker may have limited data."
    }
  ]
}
```
