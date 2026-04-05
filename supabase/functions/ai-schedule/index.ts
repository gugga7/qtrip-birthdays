import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const KIMI_BASE_URL = "https://api.moonshot.ai/v1";
const KIMI_MODEL = "kimi-k2-turbo-preview";
const DEFAULT_ALLOWED_ORIGINS = new Set([
  "http://localhost:5197",
  "http://127.0.0.1:5197",
]);
const RATE_LIMIT_WINDOW_MINUTES = getEnvInt("AI_SCHEDULE_RATE_LIMIT_WINDOW_MINUTES", 10);
const RATE_LIMIT_MAX_REQUESTS = getEnvInt("AI_SCHEDULE_RATE_LIMIT_MAX_REQUESTS", 5);
const DAILY_QUOTA_MAX_REQUESTS = getEnvInt("AI_SCHEDULE_DAILY_QUOTA_MAX_REQUESTS", 20);
const MAX_DAYS = 14;
const MAX_ACTIVITIES = 24;

interface ActivityInput {
  id: string;
  title: string;
  duration: number;
  category: string;
  location?: string;
  tags?: string[];
  description: string;
}

interface ScheduleRequest {
  destination: { name: string; country: string; localTips: string[] };
  days: number;
  activities: ActivityInput[];
  accommodation?: { name: string; location: string; type: string };
  transport?: { name: string; type: string };
}

interface ScheduleAssignment {
  activityId: string;
  day: number;
  slot: "Morning" | "Afternoon" | "Evening";
  reason?: string;
}

interface TokenClaims {
  sub?: string;
  session_id?: string;
}

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getEnvInt(name: string, fallback: number): number {
  const value = Number(Deno.env.get(name));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getKimiKey(): string {
  const key = Deno.env.get("KIMI_API_KEY");
  if (!key) {
    throw new Error("KIMI_API_KEY not configured");
  }

  return key;
}

function getSupabaseAdmin() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are not configured for ai-schedule");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getAllowedOrigins(): Set<string> {
  const origins = new Set(DEFAULT_ALLOWED_ORIGINS);
  const configuredOrigins = [
    Deno.env.get("AI_SCHEDULE_ALLOWED_ORIGINS"),
    Deno.env.get("APP_URL"),
    Deno.env.get("SITE_URL"),
    Deno.env.get("GOTRUE_SITE_URL"),
  ];

  for (const value of configuredOrigins) {
    if (!value) continue;

    for (const origin of value.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  return origins;
}

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-request-id",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };

  if (origin && getAllowedOrigins().has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
  requestId: string,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...buildCorsHeaders(origin),
      "Content-Type": "application/json",
      "X-Request-Id": requestId,
    },
  });
}

function getBearerToken(req: Request): string {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentication required");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) {
    throw new HttpError(401, "Authentication required");
  }

  return token;
}

function decodeJwtPayload(token: string): TokenClaims {
  const [, payload] = token.split(".");
  if (!payload) {
    throw new HttpError(401, "Invalid authentication token");
  }

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=");

  try {
    return JSON.parse(atob(padded)) as TokenClaims;
  } catch {
    throw new HttpError(401, "Invalid authentication token");
  }
}

function asRecord(value: unknown, fieldName: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be an object`);
  }

  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${fieldName} must be a non-empty string`);
  }

  return value.trim();
}

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function asStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be an array`);
  }

  return value.map((item, index) => asNonEmptyString(item, `${fieldName}[${index}]`));
}

function asPositiveNumber(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive number`);
  }

  return value;
}

function validateScheduleRequest(input: unknown): ScheduleRequest {
  const body = asRecord(input, "body");
  const destination = asRecord(body.destination, "destination");
  const days = asPositiveNumber(body.days, "days");

  if (!Number.isInteger(days) || days > MAX_DAYS) {
    throw new HttpError(400, `days must be an integer between 1 and ${MAX_DAYS}`);
  }

  if (!Array.isArray(body.activities) || body.activities.length === 0) {
    throw new HttpError(400, "activities must contain at least one item");
  }

  if (body.activities.length > MAX_ACTIVITIES) {
    throw new HttpError(400, `activities cannot exceed ${MAX_ACTIVITIES} items`);
  }

  if (body.activities.length > days * 3) {
    throw new HttpError(400, "Too many activities selected for the available trip slots");
  }

  const activityIds = new Set<string>();
  const activities = body.activities.map((item, index) => {
    const activity = asRecord(item, `activities[${index}]`);
    const id = asNonEmptyString(activity.id, `activities[${index}].id`);

    if (activityIds.has(id)) {
      throw new HttpError(400, `activities[${index}].id must be unique`);
    }

    activityIds.add(id);

    return {
      id,
      title: asNonEmptyString(activity.title, `activities[${index}].title`),
      duration: asPositiveNumber(activity.duration, `activities[${index}].duration`),
      category: asNonEmptyString(activity.category, `activities[${index}].category`),
      location: asOptionalString(activity.location),
      tags: Array.isArray(activity.tags)
        ? activity.tags.map((tag, tagIndex) => asNonEmptyString(tag, `activities[${index}].tags[${tagIndex}]`))
        : undefined,
      description: asNonEmptyString(activity.description, `activities[${index}].description`),
    } satisfies ActivityInput;
  });

  const request: ScheduleRequest = {
    destination: {
      name: asNonEmptyString(destination.name, "destination.name"),
      country: asNonEmptyString(destination.country, "destination.country"),
      localTips: asStringArray(destination.localTips ?? [], "destination.localTips"),
    },
    days,
    activities,
  };

  if (body.accommodation) {
    const accommodation = asRecord(body.accommodation, "accommodation");
    request.accommodation = {
      name: asNonEmptyString(accommodation.name, "accommodation.name"),
      location: asNonEmptyString(accommodation.location, "accommodation.location"),
      type: asNonEmptyString(accommodation.type, "accommodation.type"),
    };
  }

  if (body.transport) {
    const transport = asRecord(body.transport, "transport");
    request.transport = {
      name: asNonEmptyString(transport.name, "transport.name"),
      type: asNonEmptyString(transport.type, "transport.type"),
    };
  }

  return request;
}

function buildSystemPrompt(): string {
  return `You are a travel itinerary optimizer. You receive a destination, trip duration, selected activities with details, and optionally accommodation and transport info.

Your job: assign each activity to the best day and time slot for a great travel experience.

RULES:
- Time slots are: Morning, Afternoon, Evening
- Respect activity duration: a 3-4 hour activity fills an entire slot. Do not assign two long activities to the same slot.
- Use tags and categories as hints:
  - "evening", "food", "nightlife" tags → prefer Evening slot
  - "spa", "relaxing", "wellness" tags → prefer Afternoon slot
  - "sightseeing", "walking tour", "outdoor" → prefer Morning slot (cooler, better light)
  - "museum", "culture", "guided" → Morning or Afternoon
- Spread activities across all available days. Don't cram everything into day 1.
- Leave some free time — not every slot needs to be filled. Travelers appreciate breathing room.
- Consider location proximity: if two activities are in the same area, schedule them in adjacent slots on the same day.
- Consider the accommodation location for starting the day nearby.
- Maximum one activity per slot.

OUTPUT: Return ONLY a valid JSON array. No markdown, no explanation, no code fences. Just the raw JSON array:
[{"activityId": "...", "day": 1, "slot": "Morning", "reason": "Brief 8-12 word reason for this placement"}, ...]

The "reason" field should be a short, friendly explanation of WHY this slot works best.

Every activity in the input MUST appear exactly once in the output.`;
}

function buildUserMessage(req: ScheduleRequest): string {
  const lines: string[] = [
    `Destination: ${req.destination.name}, ${req.destination.country}`,
    `Trip duration: ${req.days} days`,
    `Local tips: ${req.destination.localTips.join("; ") || "none"}`,
    "",
    "Activities to schedule:",
  ];

  for (const activity of req.activities) {
    lines.push(
      `- ID: ${activity.id} | "${activity.title}" | ${activity.duration}h | Category: ${activity.category} | Location: ${activity.location || "N/A"} | Tags: ${(activity.tags || []).join(", ") || "none"} | ${activity.description}`,
    );
  }

  if (req.accommodation) {
    lines.push("", `Accommodation: ${req.accommodation.name} (${req.accommodation.type}) in ${req.accommodation.location}`);
  }

  if (req.transport) {
    lines.push(`Transport: ${req.transport.name} (${req.transport.type})`);
  }

  return lines.join("\n");
}

function parseSchedule(text: string, activityIds: string[], maxDays: number): ScheduleAssignment[] {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }

  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error("Response is not an array");
  }

  const validSlots = ["Morning", "Afternoon", "Evening"];
  const seen = new Set<string>();
  const assignments: ScheduleAssignment[] = [];

  for (const item of parsed) {
    if (
      typeof item?.activityId === "string" &&
      typeof item?.day === "number" &&
      Number.isInteger(item.day) &&
      item.day >= 1 &&
      item.day <= maxDays &&
      validSlots.includes(item.slot) &&
      activityIds.includes(item.activityId) &&
      !seen.has(item.activityId)
    ) {
      seen.add(item.activityId);
      assignments.push({
        activityId: item.activityId,
        day: item.day,
        slot: item.slot as ScheduleAssignment["slot"],
        reason: typeof item.reason === "string" ? item.reason : undefined,
      });
    }
  }

  return assignments;
}

function fillMissingAssignments(
  assignments: ScheduleAssignment[],
  activityIds: string[],
  totalDays: number,
): ScheduleAssignment[] {
  const completeAssignments = [...assignments];
  const assignedIds = new Set(completeAssignments.map((assignment) => assignment.activityId));
  const slots: ScheduleAssignment["slot"][] = ["Morning", "Afternoon", "Evening"];

  for (const activityId of activityIds) {
    if (assignedIds.has(activityId)) continue;

    let placed = false;

    for (let day = 1; day <= totalDays && !placed; day++) {
      const usedSlots = new Set(
        completeAssignments
          .filter((assignment) => assignment.day === day)
          .map((assignment) => assignment.slot),
      );

      for (const slot of slots) {
        if (!usedSlots.has(slot)) {
          completeAssignments.push({ activityId, day, slot });
          assignedIds.add(activityId);
          placed = true;
          break;
        }
      }
    }
  }

  if (completeAssignments.length !== activityIds.length) {
    throw new Error("Unable to assign every activity within the available trip slots");
  }

  return completeAssignments;
}

async function enforceUsageLimits(
  supabaseAdmin: ReturnType<typeof createClient>,
  userId: string,
) {
  const recentWindowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
  const dailyWindowStart = new Date();
  dailyWindowStart.setUTCHours(0, 0, 0, 0);

  const [recentUsage, dailyUsage] = await Promise.all([
    supabaseAdmin
      .from("ai_schedule_request_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("requested_at", recentWindowStart),
    supabaseAdmin
      .from("ai_schedule_request_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("requested_at", dailyWindowStart.toISOString()),
  ]);

  if (recentUsage.error) throw recentUsage.error;
  if (dailyUsage.error) throw dailyUsage.error;

  if ((recentUsage.count ?? 0) >= RATE_LIMIT_MAX_REQUESTS) {
    throw new HttpError(429, `Rate limit exceeded. Try again in ${RATE_LIMIT_WINDOW_MINUTES} minutes.`);
  }

  if ((dailyUsage.count ?? 0) >= DAILY_QUOTA_MAX_REQUESTS) {
    throw new HttpError(429, "Daily AI scheduling quota exceeded. Try again tomorrow.");
  }
}

async function recordRequestLog(
  supabaseAdmin: ReturnType<typeof createClient>,
  input: {
    requestId: string;
    userId: string;
    sessionId: string | null;
    destinationName: string | null;
    origin: string | null;
    activityCount: number;
    tripDays: number;
    status: string;
    responseStatus: number;
    errorMessage?: string;
  },
) {
  const { error } = await supabaseAdmin.from("ai_schedule_request_logs").insert({
    request_id: input.requestId,
    user_id: input.userId,
    session_id: input.sessionId,
    model: KIMI_MODEL,
    destination_name: input.destinationName,
    request_origin: input.origin,
    activity_count: input.activityCount,
    trip_days: input.tripDays,
    status: input.status,
    response_status: input.responseStatus,
    error_message: input.errorMessage ?? null,
    completed_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}

function getStatusLabel(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 401) return "unauthorized";
    if (error.status === 403) return "origin_blocked";
    if (error.status === 429 && error.message.toLowerCase().includes("quota")) return "quota_exceeded";
    if (error.status === 429) return "rate_limited";
    if (error.status === 400) return "validation_error";
  }

  return "provider_error";
}

function getStatusCode(error: unknown): number {
  return error instanceof HttpError ? error.status : 500;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Failed to generate schedule";
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  const origin = req.headers.get("origin");
  const allowedOrigins = getAllowedOrigins();

  if (req.method === "OPTIONS") {
    if (origin && !allowedOrigins.has(origin)) {
      return jsonResponse({ error: "Origin not allowed" }, 403, origin, requestId);
    }

    return new Response("ok", {
      headers: {
        ...buildCorsHeaders(origin),
        "X-Request-Id": requestId,
      },
    });
  }

  if (origin && !allowedOrigins.has(origin)) {
    return jsonResponse({ error: "Origin not allowed" }, 403, origin, requestId);
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, origin, requestId);
  }

  let supabaseAdmin: ReturnType<typeof createClient> | null = null;
  let userId: string | null = null;
  let sessionId: string | null = null;
  let destinationName: string | null = null;
  let activityCount = 0;
  let tripDays = 0;

  try {
    const token = getBearerToken(req);
    const claims = decodeJwtPayload(token);

    userId = claims.sub ?? null;
    sessionId = claims.session_id ?? null;

    if (!userId) {
      throw new HttpError(401, "Authentication required");
    }

    supabaseAdmin = getSupabaseAdmin();

    const body = validateScheduleRequest(await req.json());
    destinationName = body.destination.name;
    activityCount = body.activities.length;
    tripDays = body.days;

    await enforceUsageLimits(supabaseAdmin, userId);

    const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getKimiKey()}`,
      },
      body: JSON.stringify({
        model: KIMI_MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserMessage(body) },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kimi API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Kimi");
    }

    const assignments = fillMissingAssignments(
      parseSchedule(content, body.activities.map((activity) => activity.id), body.days),
      body.activities.map((activity) => activity.id),
      body.days,
    );

    await recordRequestLog(supabaseAdmin, {
      requestId,
      userId,
      sessionId,
      destinationName,
      origin,
      activityCount,
      tripDays,
      status: "success",
      responseStatus: 200,
    });

    return jsonResponse({ assignments, requestId }, 200, origin, requestId);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    const responseStatus = getStatusCode(error);

    if (supabaseAdmin && userId) {
      try {
        await recordRequestLog(supabaseAdmin, {
          requestId,
          userId,
          sessionId,
          destinationName,
          origin,
          activityCount,
          tripDays,
          status: getStatusLabel(error),
          responseStatus,
          errorMessage,
        });
      } catch (logError) {
        console.error("ai-schedule log failure:", logError);
      }
    }

    console.error("ai-schedule error:", error);
    return jsonResponse({ error: errorMessage, requestId }, responseStatus, origin, requestId);
  }
});
