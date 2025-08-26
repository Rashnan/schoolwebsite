import { mysqlTable, serial, varchar, int, timestamp } from "drizzle-orm/mysql-core";

export const registrations = mysqlTable('registrations', {
    id: serial().primaryKey(),
    registrationName: varchar({ length: 255 }).notNull(),
    totalAmount: int().notNull(),
    discountId: int(), // Reference to applied discount (nullable)
    paymentStatus: varchar({ length: 50 }).default('pending'),
    paymentReference: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow()
});
