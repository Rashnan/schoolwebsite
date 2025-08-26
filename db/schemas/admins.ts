import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const admins = mysqlTable('admins', {
    id: serial().primaryKey(),
    username: varchar({ length: 20 }),
    password: varchar({ length: 20 })
});
