import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';

// 카테고리 테이블
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 활동 기록 테이블
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 관계 정의
export const categoriesRelations = relations(categories, ({ many }) => ({
  activities: many(activities),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  category: one(categories, {
    fields: [activities.categoryId],
    references: [categories.id],
  }),
}));
