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

// Internal mutation to soft delete a pitch
export const softDeleteInternal = internalMutation({
  args: { id: v.id("pitches") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isDeleted: true });
    return args.id;
  },
});

// Internal query to list pitches with filters
export const listWithFiltersInternal = internalQuery({
  args: {
    industry: v.optional(v.string()),
    isLocal: v.optional(v.boolean()),
    website: v.optional(v.string()),
    limit: v.optional(v.number()),
    includeDeleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Website search uses unique index - return single result
    if (args.website !== undefined) {
      const pitch = await ctx.db
        .query("pitches")
        .withIndex("by_website", (q) => q.eq("website", args.website!))
        .first();

      if (!pitch || (pitch.isDeleted && !args.includeDeleted)) {
        return [];
      }

      const prospect = pitch.prospectId ? await ctx.db.get(pitch.prospectId) : null;
      return [{ ...pitch, prospectStatus: prospect?.status ?? null }];
    }

    let query = ctx.db.query("pitches");

    // Use index for single-field filters (most selective first)
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

    // Apply post-filters for multi-field queries and soft-delete
    let filtered = results.filter((p) => {
      if (args.industry !== undefined && args.isLocal !== undefined && p.isLocal !== args.isLocal) {
        return false;
      }
      if (!args.includeDeleted && p.isDeleted) {
        return false;
      }
      return true;
    });

    if (args.limit !== undefined) {
      filtered = filtered.slice(0, args.limit);
    }

    // Attach prospect status to each pitch
    const pitchesWithStatus = await Promise.all(
      filtered.map(async (pitch) => {
        const prospect = pitch.prospectId ? await ctx.db.get(pitch.prospectId) : null;
        return { ...pitch, prospectStatus: prospect?.status ?? null };
      })
    );

    return pitchesWithStatus;
  },
});

// Internal query for pitch stats
export const getStatsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allPitches = await ctx.db.query("pitches").collect();
    // Exclude deleted records from stats
    const pitches = allPitches.filter((p) => !p.isDeleted);
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
    const allPitches = await ctx.db.query("pitches").collect();
    // Exclude deleted records from stats
    const pitches = allPitches.filter((p) => !p.isDeleted);
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
