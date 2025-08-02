import db from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        
        if (!name || !email || !password) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "User already exists with this email"
            }, { status: 409 });
        }

        // Create new user
        const newUser = await db.user.create({
            data: {
                email: email,
                name: name,
                password: password
            }
        });

        if (!newUser) {
            return NextResponse.json({
                success: false,
                message: "Failed to create User"
            }, { status: 500 });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: newUser.id }, 
            process.env.MY_JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Create response
        const response = NextResponse.json({
            success: true,
            message: "User created successfully",
            user: newUser
        }, { status: 201 });

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
            message: error?.message || "Failed to create User"
        }, { status: 500 });
    }
}
