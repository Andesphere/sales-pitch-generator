import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// Internal functions (for HTTP endpoints)
// ============================================

// Internal query to get pitch by website (for duplicate checking)
export const getByWebsiteInternal = internalQuery({
  args: {
    website: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pitches")
      .withIndex("by_website", (q) => q.eq("website", args.website))
      .first();
  },
});

// Internal mutation to create a pitch
export const createInternal = internalMutation({
  args: {
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
        angle: v.string(),
        subjectLine: v.string(),
        message: v.string(),
        wordCount: v.number(),
      })
    ),
    recommendedPitch: v.number(),
    recommendedPitchReason: v.string(),
    recommendedChannel: v.string(),
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
  },
  handler: async (ctx, args) => {
    // Create the pitch
    const pitchId = await ctx.db.insert("pitches", {
      ...args,
      createdAt: Date.now(),
    });

    // If linked to a prospect, update prospect status to "pitched"
    if (args.prospectId) {
      await ctx.db.patch(args.prospectId, { status: "pitched" });
    }

    return pitchId;
  },
});

// Internal query to list pitches with filters
export const listWithFiltersInternal = internalQuery({
  args: {
    industry: v.optional(v.string()),
    isLocal: v.optional(v.boolean()),
    website: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // If searching by website, use that index
    if (args.website !== undefined) {
      const pitch = await ctx.db
        .query("pitches")
        .withIndex("by_website", (q) => q.eq("website", args.website!))
        .first();
      return pitch ? [pitch] : [];
    }

    let query = ctx.db.query("pitches");

    // Apply filters
    if (args.industry !== undefined) {
      query = ctx.db
        .query("pitches")
        .withIndex("by_industry", (q) => q.eq("industry", args.industry!));
    } else if (args.isLocal !== undefined) {
      query = ctx.db
        .query("pitches")
        .withIndex("by_isLocal", (q) => q.eq("isLocal", args.isLocal!));
    }

    const results = await query.order("desc").collect();

    // Post-filter if both industry and isLocal are specified
    let filtered = results;
    if (args.industry !== undefined && args.isLocal !== undefined) {
      filtered = results.filter(
        (p) => p.industry === args.industry && p.isLocal === args.isLocal
      );
    }

    // Apply limit
    if (args.limit !== undefined) {
      return filtered.slice(0, args.limit);
    }
    return filtered;
  },
});

// Internal query for pitch stats
export const getStatsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const pitches = await ctx.db.query("pitches").collect();
    const localCount = pitches.filter((p) => p.isLocal).length;
    const industriesSet = new Set(pitches.map((p) => p.industry));

    return {
      total: pitches.length,
      local: localCount,
      nonLocal: pitches.length - localCount,
      industries: Array.from(industriesSet),
    };
  },
});

// ============================================
// Public functions (kept for backward compatibility)
// ============================================

// Create a new pitch
export const create = mutation({
  args: {
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
        angle: v.string(),
        subjectLine: v.string(),
        message: v.string(),
        wordCount: v.number(),
      })
    ),
    recommendedPitch: v.number(),
    recommendedPitchReason: v.string(),
    recommendedChannel: v.string(),
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
  },
  handler: async (ctx, args) => {
    // Create the pitch
    const pitchId = await ctx.db.insert("pitches", {
      ...args,
      createdAt: Date.now(),
    });

    // If linked to a prospect, update prospect status to "pitched"
    if (args.prospectId) {
      await ctx.db.patch(args.prospectId, { status: "pitched" });
    }

    return pitchId;
  },
});

// Get pitch by ID
export const getById = query({
  args: {
    id: v.id("pitches"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get pitch by prospect ID
export const getByProspectId = query({
  args: {
    prospectId: v.id("prospects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pitches")
      .withIndex("by_prospectId", (q) => q.eq("prospectId", args.prospectId))
      .first();
  },
});

// Get pitch by website URL
export const getByWebsite = query({
  args: {
    website: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pitches")
      .withIndex("by_website", (q) => q.eq("website", args.website))
      .first();
  },
});

// Get recent pitches
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("pitches")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

// Get local pitches only
export const getLocalOnly = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pitches")
      .withIndex("by_isLocal", (q) => q.eq("isLocal", true))
      .collect();
  },
});

// Get pitches by industry
export const getByIndustry = query({
  args: {
    industry: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pitches")
      .withIndex("by_industry", (q) => q.eq("industry", args.industry))
      .collect();
  },
});

// Get all pitches
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pitches")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Get pitch stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const pitches = await ctx.db.query("pitches").collect();
    const localCount = pitches.filter((p) => p.isLocal).length;
    const industriesSet = new Set(pitches.map((p) => p.industry));

    return {
      total: pitches.length,
      local: localCount,
      nonLocal: pitches.length - localCount,
      industries: Array.from(industriesSet),
    };
  },
});
