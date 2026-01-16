import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// Internal functions (for HTTP endpoints)
// ============================================

// Internal query to get prospect by URL (for duplicate checking)
export const getByUrlInternal = internalQuery({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prospects")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();
  },
});

// Internal mutation to create many prospects at once
export const createManyInternal = internalMutation({
  args: {
    searchId: v.id("searches"),
    prospects: v.array(
      v.object({
        name: v.string(),
        url: v.string(),
        city: v.optional(v.string()),
        locationText: v.string(),
        isLocal: v.boolean(),
        confidence: v.string(),
        sources: v.array(v.string()),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const prospect of args.prospects) {
      const id = await ctx.db.insert("prospects", {
        ...prospect,
        searchId: args.searchId,
        status: "new",
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return ids;
  },
});

// Internal mutation to update prospect status
export const updateStatusInternal = internalMutation({
  args: {
    id: v.id("prospects"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});

// Internal query to list prospects with filters
export const listWithFiltersInternal = internalQuery({
  args: {
    status: v.optional(v.string()),
    isLocal: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("prospects");

    // Apply filters
    if (args.status !== undefined) {
      query = ctx.db
        .query("prospects")
        .withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.isLocal !== undefined) {
      query = ctx.db
        .query("prospects")
        .withIndex("by_isLocal", (q) => q.eq("isLocal", args.isLocal!));
    }

    const results = await query.order("desc").collect();

    // Post-filter if both status and isLocal are specified
    let filtered = results;
    if (args.status !== undefined && args.isLocal !== undefined) {
      filtered = results.filter(
        (p) => p.status === args.status && p.isLocal === args.isLocal
      );
    } else if (args.isLocal !== undefined && args.status === undefined) {
      // Already filtered by index
    } else if (args.status !== undefined && args.isLocal === undefined) {
      // Already filtered by index
    }

    // Apply limit
    if (args.limit !== undefined) {
      return filtered.slice(0, args.limit);
    }
    return filtered;
  },
});

// Internal query for pipeline stats
export const getPipelineStatsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const prospects = await ctx.db.query("prospects").collect();
    const stats = {
      new: 0,
      pitched: 0,
      contacted: 0,
      responded: 0,
      converted: 0,
      total: prospects.length,
    };
    for (const prospect of prospects) {
      const status = prospect.status as keyof typeof stats;
      if (status in stats && status !== "total") {
        stats[status]++;
      }
    }
    return stats;
  },
});

// ============================================
// Public functions (kept for backward compatibility)
// ============================================

// Create a new prospect
export const create = mutation({
  args: {
    searchId: v.optional(v.id("searches")),
    name: v.string(),
    url: v.string(),
    city: v.optional(v.string()),
    locationText: v.string(),
    isLocal: v.boolean(),
    confidence: v.string(),
    sources: v.array(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prospectId = await ctx.db.insert("prospects", {
      ...args,
      status: args.status ?? "new",
      createdAt: Date.now(),
    });
    return prospectId;
  },
});

// Create multiple prospects at once (for batch insert after search)
export const createMany = mutation({
  args: {
    searchId: v.id("searches"),
    prospects: v.array(
      v.object({
        name: v.string(),
        url: v.string(),
        city: v.optional(v.string()),
        locationText: v.string(),
        isLocal: v.boolean(),
        confidence: v.string(),
        sources: v.array(v.string()),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const prospect of args.prospects) {
      const id = await ctx.db.insert("prospects", {
        ...prospect,
        searchId: args.searchId,
        status: "new",
        createdAt: Date.now(),
      });
      ids.push(id);
    }
    return ids;
  },
});

// Update prospect status
export const updateStatus = mutation({
  args: {
    id: v.id("prospects"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return args.id;
  },
});

// Get prospect by ID
export const getById = query({
  args: {
    id: v.id("prospects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get prospect by URL
export const getByUrl = query({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prospects")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();
  },
});

// Get prospects by status
export const getByStatus = query({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prospects")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get prospects by search ID
export const getBySearchId = query({
  args: {
    searchId: v.id("searches"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prospects")
      .withIndex("by_searchId", (q) => q.eq("searchId", args.searchId))
      .collect();
  },
});

// Get local prospects only
export const getLocalOnly = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("prospects")
      .withIndex("by_isLocal", (q) => q.eq("isLocal", true))
      .collect();
  },
});

// Get recent prospects
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("prospects")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

// Get all prospects
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("prospects")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Get pipeline stats (count by status)
export const getPipelineStats = query({
  args: {},
  handler: async (ctx) => {
    const prospects = await ctx.db.query("prospects").collect();
    const stats = {
      new: 0,
      pitched: 0,
      contacted: 0,
      responded: 0,
      converted: 0,
      total: prospects.length,
    };
    for (const prospect of prospects) {
      const status = prospect.status as keyof typeof stats;
      if (status in stats && status !== "total") {
        stats[status]++;
      }
    }
    return stats;
  },
});
