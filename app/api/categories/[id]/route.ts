import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { updateCategorySchema } from '@/db/validators';
import { error, success, validationError, notFound } from '@/lib/api/response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (result.length === 0) {
      return notFound('Category');
    }

    return success(result[0]);
  } catch (err) {
    console.error('Error fetching category:', err);
    return error('Failed to fetch category', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const result = await db
      .update(categories)
      .set(validatedData)
      .where(eq(categories.id, id))
      .returning();

    if (result.length === 0) {
      return notFound('Category');
    }

    return success(result[0]);
  } catch (err) {
    if (err instanceof ZodError) {
      return validationError(err);
    }
    console.error('Error updating category:', err);
    return error('Failed to update category', 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (result.length === 0) {
      return notFound('Category');
    }

    return success(result[0]);
  } catch (err) {
    console.error('Error deleting category:', err);
    return error('Failed to delete category', 500);
  }
}
