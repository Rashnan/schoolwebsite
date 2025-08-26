import { admins } from "@/db/schemas/admins";
import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const users = await db.select().from(admins)

    return Response.json({
        status: 200,
        message: users,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}