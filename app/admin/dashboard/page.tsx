import { auth } from '@/lib/auth'
import { headers, redirect } from 'next/headers'
import { db } from '@/lib/db'
import { projects, categories, testimonials } from '@/lib/db/schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Tag, MessageSquare, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/sign-in')
  try {
    const [projectList, categoriesList, testimonialsList] = await Promise.all([
      db.select().from(projects),
      db.select().from(categories),
      db.select().from(testimonials),
    ])

    const totalViews = projectList.reduce((sum, p) => sum + (p.views || 0), 0)
    const publishedProjects = projectList.filter(p => p.status === 'published').length

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your portfolio admin</p>
          </div>
          <Link href="/admin/projects">
            <Button>Add New Project</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Package className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">{projectList.length}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Eye className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">{publishedProjects}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold">{totalViews}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Tag className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold">{categoriesList.length}</span>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest 5 projects</CardDescription>
          </CardHeader>
          <CardContent>
            {projectList.length === 0 ? (
              <p className="text-muted-foreground">No projects yet. Create your first project.</p>
            ) : (
              <div className="space-y-4">
                {projectList.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.description.substring(0, 60)}...</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('[v0] Dashboard error:', error)
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading dashboard</p>
      </div>
    )
  }
}
