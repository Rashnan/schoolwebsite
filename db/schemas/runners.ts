import { mysqlTable, serial, varchar, int, boolean, timestamp } from "drizzle-orm/mysql-core";

export const runners = mysqlTable('runners', {
    id: serial().primaryKey(),
    registrationId: int().notNull(),
    fullName: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    phoneNumber: varchar({ length: 20 }).notNull(),
    category: varchar({ length: 50 }).notNull(),
    tshirtSize: varchar({ length: 10 }).notNull().default('M'),
    individualPrice: int().notNull(),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});
