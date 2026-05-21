'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const hideShell = pathname?.startsWith('/login')

  if (hideShell) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex min-h-[calc(100vh-72px)]">
        <Sidebar />
        <main className="flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
