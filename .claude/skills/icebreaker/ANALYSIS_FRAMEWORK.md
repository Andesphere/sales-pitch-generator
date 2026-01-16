# Website Analysis Framework

This document provides the systematic methodology for extracting business intelligence from company websites.

## Page Discovery Strategy

### Priority 1: Must Find
- **Homepage**: Overview, branding, primary value proposition
- **Services/Products**: What they sell, pricing if available
- **Contact**: Hours, location, contact methods

### Priority 2: High Value
- **About Us**: Company story, values, team size hints
- **Pricing**: Service costs, packages, tiers
- **FAQ**: Common customer questions (goldmine for chatbot use cases)

### Priority 3: Bonus Intel
- **Blog/News**: Recent activities, expansions, pain points
- **Testimonials/Reviews**: Customer language, satisfaction areas
- **Careers**: Growth indicators, staffing challenges

## Data Extraction Checklist

### Business Identity
- [ ] Official business name
- [ ] Tagline or slogan
- [ ] Year established
- [ ] Owner/founder names (if mentioned)
- [ ] Business structure hints (family-owned, franchise, chain)

### Owner/Contact Discovery (CRITICAL)

**ALWAYS try to find a contact name.** This dramatically increases response rates.

**Priority sources:**
1. About Us page - Look for owner names, photos, bios
2. Contact page - Named contacts, team members
3. Google Business Profile - Owner responses to reviews (often signed with name)
4. LinkedIn - Search "[Business Name] owner/founder"
5. Companies House (UK) - Director names are public record
6. Facebook Business page - Often lists owner/manager

**What to capture:**
- [ ] Full name
- [ ] Role/title (Owner, Manager, Director)
- [ ] Any personal details (background, hobbies, how long they've run the business)

**If no name found:**
- Note "Owner name: Not found" in analysis
- Use "Hi," or "Hi [Business Name] team," in the pitch
- Never use "Hi there," or "To whom it may concern"

### Location & Contact
- [ ] Full street address
- [ ] Phone number(s)
- [ ] Email address(es)
- [ ] Contact form presence
- [ ] Multiple locations?

### Operating Hours (CRITICAL)
- [ ] Opening hours for each day
- [ ] Staffed/attended hours (often different!)
- [ ] Holiday hours mentioned?
- [ ] 24/7 or extended hours?
- [ ] Self-service periods identified?

**Calculate the "Hours Gap":**
```
Hours Gap = Opening Hours - Staffed Hours
Example: Open 8am-8pm (12 hrs) but staffed 8am-1pm (5 hrs) = 7 hour gap
```

### Services & Pricing
- [ ] Complete list of services
- [ ] Price points for each service
- [ ] Service packages or bundles
- [ ] Premium/express options
- [ ] Pickup/delivery services
- [ ] Commercial vs. residential offerings

### Unique Selling Points
- [ ] What do they emphasize most?
- [ ] Special equipment or capabilities?
- [ ] Awards or certifications?
- [ ] Unique service offerings?
- [ ] Target customer segments?

### Current Digital Presence
- [ ] Website quality (modern/dated)
- [ ] Mobile responsiveness
- [ ] Online booking capability
- [ ] Chat widget present?
- [ ] Social media links
- [ ] Google Business profile
- [ ] Online reviews (check Google, Yelp, industry-specific sites)

### Customer Experience Signals
- [ ] How do customers currently get questions answered?
- [ ] What's the booking/inquiry process?
- [ ] Any self-service instructions provided?
- [ ] FAQ page content (common questions = chatbot opportunities)

## Industry Detection Signals

Look for these indicators to identify the industry:

| Industry | Keywords/Signals |
|----------|------------------|
| Laundry/Dry Cleaning | wash, dry, fold, launderette, dry clean, iron, press |
| Real Estate | property, listing, rent, buy, sell, estate agent, realtor |
| Restaurant | menu, reservation, dine, cuisine, takeaway, delivery |
| Healthcare | appointment, patient, clinic, doctor, medical, dental |
| Fitness | gym, membership, class, trainer, workout, fitness |
| Salon/Spa | appointment, stylist, treatment, beauty, hair, nails |
| Legal | solicitor, attorney, lawyer, consultation, legal |
| Automotive | service, repair, MOT, car, vehicle, mechanic |

## Pain Point Identification Matrix

### Universal Pain Points (Apply to Most Businesses)
1. **After-Hours Inquiries**: Business closed but customers have questions
2. **Repetitive Questions**: Staff answering same questions repeatedly
3. **Booking Friction**: Complex process to schedule or inquire
4. **Response Delays**: Customers waiting for callbacks/emails

### Industry-Specific Pain Points
Reference the relevant industry file in `industries/` for specialized insights.

## Analysis Quality Checklist

Before proceeding to pitch generation, verify:

- [ ] Business name confirmed (not assumed)
- [ ] At least one contact method found
- [ ] Services list extracted
- [ ] Hours information gathered (or gap noted)
- [ ] At least 2 specific pain points identified with evidence
- [ ] Industry detected or classified as "general"

## Search Strategies for Missing Information

If website lacks key information:

1. **Google Search**: "[Business Name] + [Location] + hours/reviews/services"
2. **Google Maps**: Often has hours, reviews, photos
3. **Social Media**: Facebook business pages often have detailed info
4. **Review Sites**: Yelp, TripAdvisor, industry-specific review sites
5. **Business Directories**: Yell, Bing Places, Apple Maps

## Red Flags to Note

- No phone number (very small operation or digital-only)
- No physical address (may be home-based or online-only)
- Outdated website (may indicate budget constraints)
- No social media (limited digital sophistication)
- Negative reviews (opportunity but approach carefully)

These aren't disqualifiers—they're context for pitch customization.
