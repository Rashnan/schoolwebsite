import { Config, defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'mysql',
    out: './db/migrations',
    schema: './db/schemas',
    dbCredentials: {
        host: process.env.MYSQL_HOST!,
        port: Number(process.env.MYSQL_PORT!),
        database: process.env.MYSQL_DATABASE!,

        // user: process.env.MYSQL_ROOT_USER!,
        // password: process.env.MYSQL_ROOT_PASSWORD!,

        user: process.env.MYSQL_USER!,
        password: process.env.MYSQL_PASSWORD!,
    },
    verbose: true,
    strict: true
}) satisfies Config