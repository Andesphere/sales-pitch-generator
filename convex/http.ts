import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

// Helper to create JSON responses
function jsonResponse(
  data: { success: boolean; message: string; data: unknown },
  status: number = 200
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Helper to handle CORS preflight
function corsResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// ============================================
// POST /api/prospect
// Creates a search record and its prospects
// ============================================
http.route({
  path: "/api/prospect",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      // Validate required fields
      if (!body.search || !body.prospects) {
        return jsonResponse(
          {
            success: false,
            message: "Validation error: 'search' and 'prospects' are required",
            data: null,
          },
          400
        );
      }

      const { search, prospects } = body;

      // Validate search fields
      const requiredSearchFields = ["industry", "location", "count"];
      for (const field of requiredSearchFields) {
        if (search[field] === undefined) {
          return jsonResponse(
            {
              success: false,
              message: `Validation error: 'search.${field}' is required`,
              data: null,
            },
            400
          );
        }
      }

      // Create the search record
      const searchId = await ctx.runMutation(internal.searches.createInternal, {
        industry: search.industry,
        location: search.location,
        count: search.count,
        localOnly: search.localOnly ?? false,
        totalFound: search.totalFound ?? 0,
        afterDeduplication: search.afterDeduplication ?? 0,
        localCount: search.localCount ?? 0,
        prospectsReturned: search.prospectsReturned ?? prospects.length,
        searchQueries: search.searchQueries ?? [],
      });

      // Check for duplicate URLs and create prospects
      const duplicateUrls: string[] = [];
      const prospectsToCreate: Array<{
        name: string;
        url: string;
        city?: string;
        locationText: string;
        isLocal: boolean;
        confidence: string;
        sources: string[];
        notes?: string;
      }> = [];

      for (const prospect of prospects) {
        // Check if URL already exists
        const existing = await ctx.runQuery(internal.prospects.getByUrlInternal, {
          url: prospect.url,
        });

        if (existing) {
          duplicateUrls.push(prospect.url);
        } else {
          prospectsToCreate.push({
            name: prospect.name,
            url: prospect.url,
            city: prospect.city,
            locationText: prospect.locationText ?? "",
            isLocal: prospect.isLocal ?? false,
            confidence: prospect.confidence ?? "medium",
            sources: prospect.sources ?? [],
            notes: prospect.notes,
          });
        }
      }

      // Create non-duplicate prospects
      let prospectsCreated = 0;
      if (prospectsToCreate.length > 0) {
        const ids = await ctx.runMutation(internal.prospects.createManyInternal, {
          searchId,
          prospects: prospectsToCreate,
        });
        prospectsCreated = ids.length;
      }

      const message =
        duplicateUrls.length > 0
          ? `Created 1 search and ${prospectsCreated} prospects (${duplicateUrls.length} duplicate${duplicateUrls.length > 1 ? "s" : ""} skipped)`
          : `Created 1 search and ${prospectsCreated} prospects`;

      return jsonResponse(
        {
          success: true,
          message,
          data: {
            searchId,
            prospectsCreated,
            duplicatesSkipped: duplicateUrls.length,
            duplicateUrls,
          },
        },
        201
      );
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          data: null,
        },
        500
      );
    }
  }),
});

http.route({
  path: "/api/prospect",
  method: "OPTIONS",
  handler: httpAction(async () => corsResponse()),
});

// ============================================
// POST /api/pitch
// Creates a pitch and links to existing prospect
// ============================================
http.route({
  path: "/api/pitch",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      // Validate required fields
      const requiredFields = [
        "companyName",
        "website",
        "industry",
        "pitchOptions",
      ];
      for (const field of requiredFields) {
        if (body[field] === undefined) {
          return jsonResponse(
            {
              success: false,
              message: `Validation error: '${field}' is required`,
              data: null,
            },
            400
          );
        }
      }

      // Check if pitch already exists for this website
      const existingPitch = await ctx.runQuery(
        internal.pitches.getByWebsiteInternal,
        { website: body.website }
      );

      if (existingPitch) {
        return jsonResponse(
          {
            success: false,
            message: `A pitch already exists for this website (${body.website}). Use GET /api/pitches?website=... to retrieve it.`,
            data: {
              existingPitchId: existingPitch._id,
            },
          },
          409
        );
      }

      // Check if prospect exists for this URL to auto-link
      const existingProspect = await ctx.runQuery(
        internal.prospects.getByUrlInternal,
        { url: body.website }
      );

      const prospectId = existingProspect?._id;

      // Create the pitch
      // Note: Convert null to undefined for optional fields (Convex v.optional() accepts undefined, not null)
      const pitchId = await ctx.runMutation(internal.pitches.createInternal, {
        prospectId,
        companyName: body.companyName,
        owner: body.owner ?? undefined,
        website: body.website,
        industry: body.industry,
        isLocal: body.isLocal ?? false,
        location: body.location ?? { city: undefined, area: undefined },
        contact: body.contact ?? {},
        services: body.services ?? [],
        painPoints: body.painPoints ?? [],
        pitchOptions: body.pitchOptions,
        recommendedPitch: body.recommendedPitch ?? 0,
        recommendedPitchReason: body.recommendedPitchReason ?? "",
        recommendedChannel: body.recommendedChannel ?? "Email",
        outreach: body.outreach ?? {
          primaryChannel: "Email",
          primaryLink: "",
          recommendedSubjectLine: "",
          reasoning: "",
          alternatives: [],
        },
        sources: body.sources ?? [],
        customInstructions: body.customInstructions ?? undefined,
      });

      const linkedMessage = existingProspect
        ? " Linked to existing prospect (status updated to 'pitched')."
        : "";

      return jsonResponse(
        {
          success: true,
          message: `Pitch created for ${body.companyName}.${linkedMessage}`,
          data: {
            pitchId,
            prospectId: prospectId ?? null,
            linkedToExistingProspect: !!existingProspect,
          },
        },
        201
      );
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          data: null,
        },
        500
      );
    }
  }),
});

http.route({
  path: "/api/pitch",
  method: "OPTIONS",
  handler: httpAction(async () => corsResponse()),
});

// ============================================
// GET /api/prospects
// Query prospects with optional filters
// ============================================
http.route({
  path: "/api/prospects",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const status = url.searchParams.get("status");
      const isLocal = url.searchParams.get("isLocal");
      const limit = url.searchParams.get("limit");

      const prospects = await ctx.runQuery(
        internal.prospects.listWithFiltersInternal,
        {
          status: status ?? undefined,
          isLocal: isLocal === "true" ? true : isLocal === "false" ? false : undefined,
          limit: limit ? parseInt(limit, 10) : undefined,
        }
      );

      return jsonResponse({
        success: true,
        message: `Found ${prospects.length} prospects`,
        data: {
          prospects,
          total: prospects.length,
        },
      });
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          data: null,
        },
        500
      );
    }
  }),
});

http.route({
  path: "/api/prospects",
  method: "OPTIONS",
  handler: httpAction(async () => corsResponse()),
});

// ============================================
// GET /api/pitches
// Query pitches with optional filters
// ============================================
http.route({
  path: "/api/pitches",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const industry = url.searchParams.get("industry");
      const isLocal = url.searchParams.get("isLocal");
      const website = url.searchParams.get("website");
      const limit = url.searchParams.get("limit");

      const pitches = await ctx.runQuery(
        internal.pitches.listWithFiltersInternal,
        {
          industry: industry ?? undefined,
          isLocal: isLocal === "true" ? true : isLocal === "false" ? false : undefined,
          website: website ?? undefined,
          limit: limit ? parseInt(limit, 10) : undefined,
        }
      );

      return jsonResponse({
        success: true,
        message: `Found ${pitches.length} pitches`,
        data: {
          pitches,
          total: pitches.length,
        },
      });
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          data: null,
        },
        500
      );
    }
  }),
});

http.route({
  path: "/api/pitches",
  method: "OPTIONS",
  handler: httpAction(async () => corsResponse()),
});

// ============================================
// GET /api/stats
// Pipeline statistics
// ============================================
http.route({
  path: "/api/stats",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const prospectStats = await ctx.runQuery(
        internal.prospects.getPipelineStatsInternal,
        {}
      );
      const pitchStats = await ctx.runQuery(
        internal.pitches.getStatsInternal,
        {}
      );

      return jsonResponse({
        success: true,
        message: "Pipeline stats retrieved",
        data: {
          prospects: prospectStats,
          pitches: pitchStats,
        },
      });
    } catch (error) {
      return jsonResponse(
        {
          success: false,
          message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          data: null,
        },
        500
      );
    }
  }),
});

http.route({
  path: "/api/stats",
  method: "OPTIONS",
  handler: httpAction(async () => corsResponse()),
});

export default http;
