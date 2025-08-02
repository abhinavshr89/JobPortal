"use server";

import db from "@/lib/prisma"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function createUser(data){
    try {
        const {name, email, password} = data;
        if(!name || !email || !password){
            return {
                success: false,
                message: "All fields are required"
            };
        }
        // first find if the user already exists 
        const existingUser = await db.user.findUnique({
            where:{
                email: email
            }
        })

        if(existingUser){
            return {
                success: false,
                message: "User already exists with this email"
            };
        }

        // create a new user 
        const newUser = await db.user.create({
            data:{
                email: email,
                name: name,
                password: password
            }
        })

        if(!newUser){
            return {
                success: false,
                message: "Failed to create User"
            };
        }

        // create a JWT token
        const token = jwt.sign({ id: newUser.id }, process.env.MY_JWT_SECRET, { expiresIn: '1h' });

        // Set the token in cookies
        const cookieStore = await cookies();
        cookieStore.set('token', token, { httpOnly: true });

        return {
            success: true,
            message: "User created successfully",
            user: newUser
        };
    } catch (error) {
        // Return the actual error message
        return {
            success: false,
            message: error?.message || "Failed to create User"
        };
    }
}

export async function loginUser(data){
    try {
        const {email, password} = data;
        if(!email || !password){
            return {
                success: false,
                message: "All fields are required"
            };
        }

        // find the user by email
        const user = await db.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user){
            return {
                success: false,
                message: "User not found"
            };
        }

        // check password (assuming you have a method to verify password)
        if(user.password !== password){ // replace with actual password verification logic
            return {
                success: false,
                message: "Invalid credentials"
            };
        }

        // create a JWT token
        const token = jwt.sign({ id: user.id }, process.env.MY_JWT_SECRET, { expiresIn: '1h' });

        // Set the token in cookies
        const cookieStore = await cookies();
        cookieStore.set('token', token, { httpOnly: true });

        return {
            success: true,
            message: "Logged in successfully",
            user: user
        };
    } catch (error) {
        return {
            success: false,
            message: error?.message || "Failed to login"
        };
    }
    
}


export async function getUserFromCookie() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return null; // No token found
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.MY_JWT_SECRET);
        
        // Fetch user from database
        const user = await db.user.findUnique({
            where: { id: decoded.id }
        });

        return user;
    } catch (error) {
        return null; // Return null if there's an error
    }
}


export const logoutUser = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('token'); // Delete the token cookie

        return {
            success: true,
            message: "Logged out successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error?.message || "Failed to logout"
        };
    }
}