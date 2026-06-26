import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, BarChart3, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="font-bold text-lg">
              Admin Dashboard
            </Link>
            <div className="flex gap-1">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Projects
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session?.user && (
              <span className="text-sm text-muted-foreground">{session.user.email}</span>
            )}
            {session?.user && (
            <form action={async () => {
              'use server'
              await auth.api.signOut()
              redirect('/admin/sign-in')
            }}>
              <Button type="submit" variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </form>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
