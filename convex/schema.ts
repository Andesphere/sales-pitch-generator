import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tracks each /prospect search run
  searches: defineTable({
    industry: v.string(),
    location: v.string(),
    count: v.number(),
    localOnly: v.boolean(),
    totalFound: v.number(),
    afterDeduplication: v.number(),
    localCount: v.number(),
    prospectsReturned: v.number(),
    searchQueries: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_industry", ["industry"])
    .index("by_location", ["location"])
    .index("by_createdAt", ["createdAt"]),

  // Individual businesses found
  prospects: defineTable({
    searchId: v.optional(v.id("searches")),
    name: v.string(),
    url: v.string(),
    city: v.optional(v.string()),
    locationText: v.string(),
    isLocal: v.boolean(),
    confidence: v.string(), // "high" | "medium" | "low"
    sources: v.array(v.string()), // ["tavily", "exa", "websearch"]
    notes: v.optional(v.string()),
    status: v.string(), // "new" | "pitched" | "contacted" | "responded" | "converted"
    isDeleted: v.optional(v.boolean()), // undefined = false for existing records
    createdAt: v.number(),
  })
    .index("by_searchId", ["searchId"])
    .index("by_status", ["status"])
    .index("by_url", ["url"])
    .index("by_isLocal", ["isLocal"])
    .index("by_createdAt", ["createdAt"]),

  // Generated icebreaker pitches
  pitches: defineTable({
    prospectId: v.optional(v.id("prospects")),
    companyName: v.string(),
    owner: v.optional(v.string()),
    website: v.string(),
    industry: v.string(),
    isLocal: v.boolean(),
    location: v.object({
      address: v.optional(v.string()),
      city: v.optional(v.string()),
      area: v.optional(v.string()),
    }),
    contact: v.object({
      phone: v.optional(v.string()),
      mobile: v.optional(v.string()),
      email: v.optional(v.string()),
      form: v.optional(v.string()),
      facebook: v.optional(v.string()),
    }),
    services: v.array(
      v.object({
        name: v.string(),
        price: v.optional(v.string()),
      })
    ),
    painPoints: v.array(v.string()),
    pitchOptions: v.array(
      v.object({
        angle: v.string(), // "pain-point" | "opportunity" | "social-proof"
        subjectLine: v.string(),
        message: v.string(),
        wordCount: v.number(),
      })
    ),
    recommendedPitch: v.number(), // Index of best pitch (0, 1, or 2)
    recommendedPitchReason: v.string(),
    recommendedChannel: v.string(), // "Email" | "Contact Form" | "Facebook" | "LinkedIn" | "Phone"
    outreach: v.object({
      primaryChannel: v.string(),
      primaryLink: v.string(),
      recommendedSubjectLine: v.string(),
      reasoning: v.string(),
      alternatives: v.array(
        v.object({
          channel: v.string(),
          link: v.string(),
          note: v.optional(v.string()),
        })
      ),
    }),
    sources: v.array(
      v.object({
        page: v.string(),
        url: v.string(),
        found: v.string(),
      })
    ),
    customInstructions: v.optional(v.string()),
    isDeleted: v.optional(v.boolean()), // undefined = false for existing records
    createdAt: v.number(),
  })
    .index("by_prospectId", ["prospectId"])
    .index("by_website", ["website"])
    .index("by_isLocal", ["isLocal"])
    .index("by_industry", ["industry"])
    .index("by_createdAt", ["createdAt"]),
});
