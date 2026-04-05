import { FunctionsHttpError } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';
import type { Activity, AccommodationType, Destination, TransportType, ScheduleSlotName } from './types';

export interface ScheduleAssignment {
  activityId: string;
  day: number;
  slot: ScheduleSlotName;
  reason?: string;
}

interface AIScheduleRequest {
  destination: { name: string; country: string; localTips: string[] };
  days: number;
  activities: Array<{
    id: string;
    title: string;
    duration: number;
    category: string;
    location?: string;
    tags?: string[];
    description: string;
  }>;
  accommodation?: { name: string; location: string; type: string };
  transport?: { name: string; type: string };
}

export async function fetchAISchedule(
  destination: Destination,
  days: number,
  activities: Activity[],
  accommodation: AccommodationType | null,
  transport: TransportType | null,
): Promise<ScheduleAssignment[]> {
  if (!isSupabaseConfigured) {
    throw new Error('Missing Supabase configuration');
  }

  const body: AIScheduleRequest = {
    destination: {
      name: destination.name,
      country: destination.country,
      localTips: destination.localTips,
    },
    days,
    activities: activities.map((a) => ({
      id: a.id,
      title: a.title,
      duration: a.duration,
      category: a.category,
      location: a.location,
      tags: a.tags,
      description: a.description,
    })),
    ...(accommodation && {
      accommodation: {
        name: accommodation.name,
        location: accommodation.location,
        type: accommodation.type,
      },
    }),
    ...(transport && {
      transport: {
        name: transport.name,
        type: transport.type,
      },
    }),
  };

  const { data, error } = await supabase.functions.invoke<{ assignments: ScheduleAssignment[] }>(
    'ai-schedule',
    { body },
  );

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const err = await error.context.json().catch(() => ({ error: error.message }));
      throw new Error(err.error || error.message);
    }

    throw new Error(error.message || 'Failed to generate schedule');
  }

  if (!data || !Array.isArray(data.assignments)) {
    throw new Error('Invalid response: assignments missing');
  }

  const validSlots = new Set<string>(['Morning', 'Afternoon', 'Evening']);
  for (const a of data.assignments) {
    if (!a.activityId || typeof a.day !== 'number' || !validSlots.has(a.slot)) {
      throw new Error('Invalid assignment in response');
    }
  }

  return data.assignments as ScheduleAssignment[];
}
