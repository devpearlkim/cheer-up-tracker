import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { activities, categories } from './schema';

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);
export const updateCategorySchema = insertCategorySchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertActivitySchema = createInsertSchema(activities);
export const selectActivitySchema = createSelectSchema(activities);
export const updateActivitySchema = insertActivitySchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

export type Category = z.infer<typeof selectCategorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export type Activity = z.infer<typeof selectActivitySchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type UpdateActivity = z.infer<typeof updateActivitySchema>;

export type ActivityWithCategory = Activity & {
  category: Category | null;
};
