import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        }, { status: 200 });

        // Clear the cookie by setting it with past expiration
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/'
        });

        return response;

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error?.message || "Failed to logout"
        }, { status: 500 });
    }
}
