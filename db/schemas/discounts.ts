import { mysqlTable, serial, varchar, int, decimal, boolean, timestamp } from "drizzle-orm/mysql-core";

export const discounts = mysqlTable('discounts', {
    id: serial().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    code: varchar({ length: 50 }).notNull().unique(),
    type: varchar({ length: 20 }).notNull(), // 'percentage' or 'fixed'
    value: decimal({ precision: 10, scale: 2 }).notNull(),
    minParticipants: int().default(1),
    validFrom: timestamp().notNull(),
    validUntil: timestamp().notNull(),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});
