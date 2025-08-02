import React, { Suspense } from 'react'
import Header from '@/components/header'

function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default MainLayout