'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Pill, Syringe, Calendar, FileText, AlertCircle, BarChart3, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/family', label: 'Family', icon: Users },
  { href: '/medications', label: 'Meds', icon: Pill },
  { href: '/vaccinations', label: 'Vaccines', icon: Syringe },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/records', label: 'Records', icon: FileText },
  { href: '/emergency', label: 'Emergency', icon: AlertCircle },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
]

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between min-h-[56px] md:min-h-[64px] gap-2 py-2">
          <Link href="/dashboard" className="text-base md:text-xl font-bold text-primary flex-shrink-0">
            SafeFam
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-wrap justify-center flex-1 max-w-3xl mx-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs lg:text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5 flex-shrink-0 h-9 px-3"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline text-sm">Logout</span>
          </Button>
        </div>

        <div className="md:hidden -mx-4 px-2 pb-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 min-w-max px-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
