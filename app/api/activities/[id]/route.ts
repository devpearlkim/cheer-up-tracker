import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema';
import { updateActivitySchema } from '@/db/validators';
import { error, success, validationError, notFound } from '@/lib/api/response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await db.query.activities.findFirst({
      where: eq(activities.id, id),
      with: { category: true },
    });

    if (!result) {
      return notFound('Activity');
    }

    return success(result);
  } catch (err) {
    console.error('Error fetching activity:', err);
    return error('Failed to fetch activity', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateActivitySchema.parse(body);

    const updated = await db
      .update(activities)
      .set(validatedData)
      .where(eq(activities.id, id))
      .returning();

    if (updated.length === 0) {
      return notFound('Activity');
    }

    const result = await db.query.activities.findFirst({
      where: eq(activities.id, id),
      with: { category: true },
    });

    return success(result);
  } catch (err) {
    if (err instanceof ZodError) {
      return validationError(err);
    }
    console.error('Error updating activity:', err);
    return error('Failed to update activity', 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const activity = await db.query.activities.findFirst({
      where: eq(activities.id, id),
      with: { category: true },
    });

    if (!activity) {
      return notFound('Activity');
    }

    await db.delete(activities).where(eq(activities.id, id));

    return success(activity);
  } catch (err) {
    console.error('Error deleting activity:', err);
    return error('Failed to delete activity', 500);
  }
}
