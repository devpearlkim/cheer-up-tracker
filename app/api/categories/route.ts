import { NextRequest } from 'next/server';
import { ZodError } from 'zod';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { insertCategorySchema } from '@/db/validators';
import { error, success, validationError } from '@/lib/api/response';

export async function GET() {
  try {
    const result = await db.select().from(categories);
    return success(result);
  } catch (err) {
    console.error('Error fetching categories:', err);
    return error('Failed to fetch categories', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = insertCategorySchema.parse(body);

    const result = await db
      .insert(categories)
      .values(validatedData)
      .returning();

    return success(result[0], 201);
  } catch (err) {
    if (err instanceof ZodError) {
      return validationError(err);
    }
    console.error('Error creating category:', err);
    return error('Failed to create category', 500);
  }
}
