# Industry Auto-Detection Guide

This document helps identify which industry knowledge file to load based on website analysis.

## Detection Process

1. Scan website content for industry keywords
2. Match against patterns below
3. Load corresponding industry file if available
4. Fall back to generic approach if no match

---

## Available Industry Files

| Industry | File | Status |
|----------|------|--------|
| Laundry & Dry Cleaning | `laundry.md` | ✅ Available |
| Real Estate | `real-estate.md` | 🔜 Planned |
| Restaurant & Food Service | `restaurant.md` | 🔜 Planned |
| Healthcare & Medical | `healthcare.md` | 🔜 Planned |
| Fitness & Wellness | `fitness.md` | 🔜 Planned |
| Salon & Beauty | `salon.md` | 🔜 Planned |
| Legal Services | `legal.md` | 🔜 Planned |
| Automotive | `automotive.md` | 🔜 Planned |

---

## Detection Keywords by Industry

### Laundry & Dry Cleaning
**Primary keywords:**
- launderette, laundromat, laundrette
- dry cleaning, dry cleaners
- wash and fold, service wash
- ironing service, pressing

**Secondary keywords:**
- self-service washing
- coin-operated
- duvet cleaning
- wedding dress cleaning
- alterations, repairs
- collection and delivery

**Match file:** `laundry.md`

---

### Real Estate (Coming Soon)
**Primary keywords:**
- estate agent, real estate, realtor
- property for sale, properties to rent
- lettings, sales
- mortgage, conveyancing

**Secondary keywords:**
- viewings, valuations
- buy, sell, rent, let
- residential, commercial property
- landlord, tenant

**Match file:** `real-estate.md` (not yet created)

---

### Restaurant & Food Service (Coming Soon)
**Primary keywords:**
- restaurant, café, bistro
- menu, reservations
- dine-in, takeaway, delivery

**Secondary keywords:**
- cuisine, chef
- booking, table
- catering, events

**Match file:** `restaurant.md` (not yet created)

---

### Healthcare & Medical (Coming Soon)
**Primary keywords:**
- clinic, surgery, practice
- doctor, dentist, physician
- patient, appointment
- medical, dental, healthcare

**Secondary keywords:**
- consultation, treatment
- NHS, private healthcare
- prescription, referral

**Match file:** `healthcare.md` (not yet created)

---

### Fitness & Wellness (Coming Soon)
**Primary keywords:**
- gym, fitness center, health club
- personal training, classes
- membership

**Secondary keywords:**
- workout, exercise
- yoga, pilates, crossfit
- trainer, coach

**Match file:** `fitness.md` (not yet created)

---

### Salon & Beauty (Coming Soon)
**Primary keywords:**
- salon, spa, beauty
- hair, nails, skincare
- stylist, therapist

**Secondary keywords:**
- appointment, booking
- treatment, service
- manicure, pedicure, facial

**Match file:** `salon.md` (not yet created)

---

### Legal Services (Coming Soon)
**Primary keywords:**
- solicitor, attorney, lawyer
- law firm, legal services
- legal advice

**Secondary keywords:**
- consultation, case
- litigation, conveyancing
- family law, criminal law, corporate

**Match file:** `legal.md` (not yet created)

---

### Automotive (Coming Soon)
**Primary keywords:**
- garage, mechanic, auto repair
- car service, MOT
- dealership

**Secondary keywords:**
- repair, maintenance
- tyres, brakes, oil change
- vehicle, car, van

**Match file:** `automotive.md` (not yet created)

---

## Fallback: Generic Approach

If no industry match is found, use these universal value propositions:

### Universal Chatbot Benefits
1. **24/7 Availability**: Answer customer questions anytime
2. **Instant Responses**: No waiting for callbacks or emails
3. **Consistent Information**: Same accurate answers every time
4. **Staff Time Savings**: Handle repetitive questions automatically
5. **Lead Capture**: Collect contact info from interested visitors

### Universal Pain Points to Explore
1. After-hours inquiries going unanswered
2. Staff spending time on repetitive questions
3. Customers abandoning due to slow response
4. Complex services requiring explanation
5. Booking/scheduling friction

### Generic Success Story Pattern
> "We recently helped a [similar business type] add an AI chatbot to their website. Within the first month, it was handling [X] customer conversations that would have otherwise gone to voicemail or waited for an email response. Their [owner/manager] told me it freed up significant staff time while ensuring no customer question goes unanswered."

---

## Adding New Industries

To add a new industry:

1. Copy `_template.md` to `[industry-name].md`
2. Fill in all sections with industry-specific knowledge
3. Add keywords to this INDEX.md file
4. Update the "Available Industry Files" table

See `_template.md` for the required structure.
