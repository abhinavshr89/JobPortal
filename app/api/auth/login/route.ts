import db from "@/lib/prisma";
import jwt from 'jsonwebtoken'

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        // Find the user by email
        const user = await db.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Check password (replace with actual password verification logic)
        if (user.password !== password) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id }, 
            process.env.MY_JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Logged in successfully",
            user: user
        }, { status: 200 });

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
            path: '/'
        });

        return response;

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error?.message || "Failed to login"
        }, { status: 500 });
    }
}
