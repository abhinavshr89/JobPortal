import db from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No authentication token found"
            }, { status: 401 });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.MY_JWT_SECRET);
        
        // Fetch user from database
        const user = await db.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                // exclude password
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: user
        }, { status: 200 });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({
                success: false,
                message: "Token expired"
            }, { status: 401 });
        }
        
        return NextResponse.json({
            success: false,
            message: "Invalid token"
        }, { status: 401 });
    }
}
