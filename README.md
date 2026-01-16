# Sales Pitch Generator (Icebreaker)

A Claude Code skill that analyzes any company website and generates a personalized AI chatbot sales pitch.

## Quick Start

```bash
cd /path/to/sales-pitch-generator
/icebreaker https://example-business.com
```

## What It Does

1. **Discovers** all relevant pages on the target website (via link extraction)
2. **Fetches** child pages in parallel for services, pricing, contact info
3. **Analyzes** business details, services, pricing, and operating hours
4. **Detects** the industry and loads relevant knowledge
5. **Identifies** specific pain points where a chatbot would help
6. **Generates** a personalized, ready-to-send icebreaker message

## Tool Strategy

This skill uses **native Claude Code tools only** (no paid APIs):

- **WebFetch**: Primary tool for extracting page content
- **WebSearch**: For finding reviews or additional context

**Why native tools?** Testing showed Tavily/Exa provide marginal benefit for this use case. Native WebFetch can:
1. Extract all links from a homepage (discover site structure)
2. Fetch child pages in parallel (get detailed pricing/services)
3. Provide clean, summarized output

This keeps the skill free to run with no external API costs.

## Output Format

The skill produces two sections:

### 📊 Business Analysis
- Company profile and contact information
- Services and pricing identified
- Operating hours (with gaps highlighted)
- Current digital presence assessment
- Specific pain points identified

### 💬 Personalized Icebreaker
A 150-200 word message ready to send, including:
- Specific references to their business
- Identified pain point
- Relevant success story
- Low-pressure call to action

## Supported Industries

| Industry | Status | File |
|----------|--------|------|
| Laundry & Dry Cleaning | ✅ Ready | `industries/laundry.md` |
| Real Estate | 🔜 Planned | - |
| Restaurant | 🔜 Planned | - |
| Healthcare | 🔜 Planned | - |
| Fitness | 🔜 Planned | - |
| Salon & Beauty | 🔜 Planned | - |
| Legal | 🔜 Planned | - |
| Automotive | 🔜 Planned | - |

**Note:** The skill works for ANY industry. Industry files add specialized knowledge and success stories, but the core analysis and pitch generation works generically.

## Adding New Industries

1. Copy the template:
   ```bash
   cp .claude/skills/icebreaker/industries/_template.md \
      .claude/skills/icebreaker/industries/[industry-name].md
   ```

2. Fill in all sections:
   - Industry overview
   - Common pain points (with evidence signals)
   - Success stories (3 recommended)
   - Industry terminology
   - Key services to identify
   - Typical pricing patterns
   - Objection handling

3. Update `industries/INDEX.md`:
   - Add detection keywords
   - Update the availability table

## Project Structure

```
sales-pitch-generator/
├── .claude/
│   └── skills/
│       └── icebreaker/
│           ├── SKILL.md              # Main skill entry point
│           ├── ANALYSIS_FRAMEWORK.md # Website analysis methodology
│           ├── PITCH_STRUCTURE.md    # Pitch writing framework
│           └── industries/
│               ├── INDEX.md          # Industry detection guide
│               ├── laundry.md        # Laundry expertise
│               └── _template.md      # Template for new industries
├── README.md                         # This file
└── examples/
    └── fairfax-launderette-example.md  # Reference output
```

## Skill Files Explained

### SKILL.md
The main entry point. Defines the slash command, orchestrates the workflow, and specifies the output format.

### ANALYSIS_FRAMEWORK.md
Systematic methodology for extracting business intelligence from websites. Includes checklists, search strategies, and quality verification.

### PITCH_STRUCTURE.md
The HRPSC framework for writing effective pitches:
- **H**ook - Show you've done research
- **R**esearch Proof - Specific insight
- **P**ain Point - Connect to their challenge
- **S**olution - Present chatbot with success story
- **C**all to Action - Low-pressure conversation invitation

### industries/INDEX.md
Auto-detection guide with keywords for each industry. Also provides fallback strategies for unknown industries.

### industries/[industry].md
Deep domain knowledge including:
- Common pain points with evidence signals
- Ready-to-use success stories
- Industry-specific terminology
- Pricing patterns for reference
- Objection handling scripts

## Tips for Best Results

1. **Use full URLs**: Include `https://` prefix
2. **Check the website first**: Ensure it's accessible
3. **Review the output**: Verify accuracy before sending
4. **Customize if needed**: The pitch is a starting point

## Example Usage

```bash
# Analyze a launderette
/icebreaker https://fairfaxlaunderette.co.uk

# Analyze a restaurant (uses generic approach until industry file added)
/icebreaker https://local-restaurant.com

# Analyze any business
/icebreaker https://any-business-website.com
```

## Troubleshooting

**"URL inaccessible"**
- Check the URL is correct
- Ensure the website is publicly accessible
- Try with/without `www.`

**"Missing information"**
- Some websites lack key details
- The skill will note what couldn't be found
- Consider manual research for gaps

**"Wrong industry detected"**
- The skill uses keyword matching
- Generic approach still works well
- Industry files enhance but aren't required

## Contributing

To improve this skill:

1. **Add industry files**: Use `_template.md` as a starting point
2. **Improve detection**: Add keywords to `INDEX.md`
3. **Enhance analysis**: Update `ANALYSIS_FRAMEWORK.md`
4. **Refine pitches**: Improve `PITCH_STRUCTURE.md`

## License

Internal use only.
