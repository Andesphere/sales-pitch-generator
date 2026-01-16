# Prospect Search Strategy

This document outlines the search methodology for finding business prospects.

## Available Search Tools

| Tool | Strengths | Best For |
|------|-----------|----------|
| `mcp__tavily__tavily-search` | Comprehensive results, good for directories | General business discovery |
| `mcp__exa__web_search_exa` | Rich snippets, direct website discovery | Finding actual business websites |
| `WebSearch` | Fallback option | When other tools fail |

## Search Query Patterns

### Primary Queries

These should be run on both Tavily and Exa in parallel:

```
Pattern 1: Direct search
"[industry] [location]"
Example: "launderette Southend-on-Sea"

Pattern 2: Near search
"[industry] near [location] UK"
Example: "launderette near Southend-on-Sea UK"

Pattern 3: In search
"[industry] in [location]"
Example: "launderette in Southend-on-Sea"
```

### Directory-Specific Queries

Use these for Tavily to capture directory listings:

```
Pattern 4: Yell.com (UK yellow pages)
"[industry] [location] site:yell.com"
Example: "launderette Southend-on-Sea site:yell.com"

Pattern 5: Yelp UK
"[industry] [location] site:yelp.co.uk"
Example: "launderette Southend-on-Sea site:yelp.co.uk"

Pattern 6: Google Maps
"[industry] [location] site:google.com/maps"
Example: "launderette Southend-on-Sea site:google.com/maps"
```

### Enrichment Queries

Use these for additional context:

```
Pattern 7: Opening hours (indicates active business)
"[industry] [location] opening hours"
Example: "launderette Southend-on-Sea opening hours"

Pattern 8: Contact (confirms web presence)
"[industry] [location] contact"
Example: "launderette Southend-on-Sea contact"

Pattern 9: Best-of (quality indicator)
"best [industry] [location]"
Example: "best launderette Southend-on-Sea"
```

## Recommended Search Execution

### For Standard Search (count ≤ 10)

Run in parallel:
1. **Tavily**: Primary query + directory query
2. **Exa**: Primary query + "business website" modifier

```javascript
// Parallel execution
await Promise.all([
  tavily_search("[industry] [location]"),
  tavily_search("[industry] [location] site:yell.com"),
  exa_search("[industry] [location] business website"),
  exa_search("[industry] near [location] UK")
]);
```

### For Extended Search (count > 10)

Add additional queries:
1. All standard queries above
2. Near search variants
3. Best-of queries
4. Opening hours queries

## Result Extraction

### From Search Results

Extract these fields from each result:

| Field | Source | Priority |
|-------|--------|----------|
| `url` | Result URL | Required |
| `name` | Title or snippet | Required |
| `location` | Snippet, address text | Preferred |
| `description` | Snippet | Optional |

### URL Processing

1. **Direct business sites**: Keep as-is
   - Example: `https://fairfaxlaunderette.co.uk`

2. **Directory listings**: Extract business name for secondary search
   - Input: `https://www.yell.com/biz/fairfax-launderette-southend-on-sea/`
   - Action: Note as directory source, try to find direct site

3. **Social media**: Note but prefer actual website
   - Facebook pages, Instagram profiles indicate active business
   - Use to confirm business exists if no website found

4. **URL cleaning**:
   - Remove tracking parameters (`?utm_*`, `?ref=*`)
   - Normalize to `https://` where possible
   - Remove trailing slashes for consistency

## Deduplication Strategy

### Domain-Based Grouping

```
Step 1: Extract root domain from URL
  https://www.fairfaxlaunderette.co.uk/contact → fairfaxlaunderette.co.uk
  https://fairfaxlaunderette.co.uk → fairfaxlaunderette.co.uk

Step 2: Group results by root domain

Step 3: Merge records
  - Take longest/most complete name
  - Take most specific location
  - Keep all source URLs for reference
```

### Handling Variations

| Scenario | Action |
|----------|--------|
| Same business, different pages | Keep one, use most relevant page |
| Same business from multiple sources | Merge data, keep best URL |
| Similar names, different domains | Keep both (may be different businesses) |
| Directory vs direct site | Prefer direct site, note directory as source |

## Confidence Scoring

Assign confidence based on available data:

| Level | Criteria |
|-------|----------|
| **High** | Has business website + name + location all from reliable source |
| **Medium** | Has 2 of 3: website, name, location |
| **Low** | Has only 1 of 3, or data from single source |

### Reliability Ranking

1. **Most reliable**: Business's own website
2. **Reliable**: Established directories (Yell, Yelp, Google Maps)
3. **Less reliable**: Social media pages
4. **Least reliable**: Blog mentions, news articles

## Search Optimization Tips

### Improve Result Quality

1. **Add "UK"** to location if not already specific
2. **Use quotes** around multi-word locations: `"Southend-on-Sea"`
3. **Try industry synonyms**:
   - launderette / laundromat / laundrette / laundry
   - hair salon / hairdresser / barber
   - restaurant / cafe / eatery

### Handle Low Results

If initial search returns < 5 results:

1. **Broaden location**: "Essex" instead of "Southend-on-Sea"
2. **Try synonyms**: "laundromat" instead of "launderette"
3. **Remove site: filters**: Search without directory constraints
4. **Add context**: "opening hours" or "contact" to find active businesses

### Handle Irrelevant Results

Filter out:
- National chains without local relevance
- Closed businesses (check for "permanently closed" markers)
- Aggregator sites that list multiple businesses
- News articles about the industry (not actual businesses)

## Example Search Session

**Input:** `/prospect launderette --location "Southend-on-Sea" --count 5`

**Queries executed:**
```
Tavily: "launderette Southend-on-Sea"
Tavily: "launderette Southend-on-Sea site:yell.com"
Exa: "launderette Southend-on-Sea business website"
Exa: "launderette near Southend-on-Sea UK"
```

**Raw results:** 18 items

**After deduplication:** 7 unique businesses

**After confidence filter:** 5 high/medium confidence

**Output:** 5 prospects saved to JSON
