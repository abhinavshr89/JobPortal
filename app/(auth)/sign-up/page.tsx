"use client";
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createUser } from '@/action/user.action';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SignUpPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, setUser } = useAuth();
  const router = useRouter();

  if(user){
    router.push("/");
    return null; // Prevent rendering if user is already logged in
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    const res = await createUser(form)
    if (res?.success) {
      setSuccess(res.message || 'Account created successfully!')
      setUser(res.user) // update auth state
      setForm({ name: '', email: '', password: '' })
      router.push("/") 
    } else {
      setError(res?.message || 'Failed to create account')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen font-poppins items-center justify-center bg-[var(--background)]">
      <Card className="w-full max-w-md bg-[var(--card)] border-[var(--border)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--primary)] text-center">Sign Up</CardTitle>
          <CardDescription className="text-[var(--muted-foreground)] text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardContent className="space-y-4">
            {error && <div className="text-[var(--destructive)] text-sm">{error}</div>}
            {success && <div className="text-green-400 text-sm">{success}</div>}
            <div>
              <label className="block mb-1 text-[var(--foreground)] font-medium">Name</label>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                autoComplete="off"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 text-[var(--foreground)] font-medium">Email</label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                autoComplete="off"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 text-[var(--foreground)] font-medium">Password</label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                autoComplete="off"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--secondary)] text-[var(--primary-foreground)] mt-3"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </CardFooter>
          <div className="text-center mt-2">
            <span className="text-[var(--muted-foreground)] text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-black dark:text-white hover:underline">
                Login
              </Link>
            </span>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default SignUpPage