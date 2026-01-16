import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx } from "./_generated/server";

const searchArgs = {
  industry: v.string(),
  location: v.string(),
  count: v.number(),
  localOnly: v.boolean(),
  totalFound: v.number(),
  afterDeduplication: v.number(),
  localCount: v.number(),
  prospectsReturned: v.number(),
  searchQueries: v.array(v.string()),
};

type SearchArgs = {
  industry: string;
  location: string;
  count: number;
  localOnly: boolean;
  totalFound: number;
  afterDeduplication: number;
  localCount: number;
  prospectsReturned: number;
  searchQueries: string[];
};

async function insertSearch(ctx: MutationCtx, args: SearchArgs): Promise<Id<"searches">> {
  return ctx.db.insert("searches", { ...args, createdAt: Date.now() });
}

// Internal mutation for HTTP endpoint
export const createInternal = internalMutation({
  args: searchArgs,
  handler: insertSearch,
});

// Create a new search record (public - kept for backward compatibility)
export const create = mutation({
  args: searchArgs,
  handler: insertSearch,
});

// Get recent searches
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const searches = await ctx.db
      .query("searches")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
    return searches;
  },
});

// Get search by ID
export const getById = query({
  args: {
    id: v.id("searches"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get searches by industry
export const getByIndustry = query({
  args: {
    industry: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("searches")
      .withIndex("by_industry", (q) => q.eq("industry", args.industry))
      .collect();
  },
});

// Get searches by location
export const getByLocation = query({
  args: {
    location: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("searches")
      .withIndex("by_location", (q) => q.eq("location", args.location))
      .collect();
  },
});

// Get all searches
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("searches")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// Internal query for HTTP endpoint
export const listInternal = internalQuery({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    return await ctx.db
      .query("searches")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});
