import { desc, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { db } from '@/db';
import { activities } from '@/db/schema';
import { insertActivitySchema } from '@/db/validators';
import { error, success, validationError } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoryId = searchParams.get('categoryId');

    const result = await db.query.activities.findMany({
      where: categoryId ? eq(activities.categoryId, categoryId) : undefined,
      with: { category: true },
      orderBy: desc(activities.date),
    });

    return success(result);
  } catch (err) {
    console.error('Error fetching activities:', err);
    return error('Failed to fetch activities', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = insertActivitySchema.parse(body);

    const inserted = await db
      .insert(activities)
      .values(validatedData)
      .returning();

    const result = await db.query.activities.findFirst({
      where: eq(activities.id, inserted[0].id),
      with: { category: true },
    });

    return success(result, 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return validationError(err);
    }
    console.error('Error creating activity:', err);
    return error('Failed to create activity', 500);
  }
}
