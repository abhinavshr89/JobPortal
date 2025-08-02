import { NextRequest, NextResponse } from "next/server";


export function middleware(request:NextRequest){
    const authToken = request.cookies.get('token');
    const {pathName} = request.nextUrl;

    const publicRoutes = ['/', '/login', '/signup'];
    const protectedRoutes = ['/dashboard', '/profile', '/saved-jobs'];

    if (protectedRoutes.includes(pathName) && !authToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (publicRoutes.includes(pathName) && authToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}