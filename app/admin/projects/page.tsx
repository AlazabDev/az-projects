import { auth } from '@/lib/auth'
import { headers, redirect } from 'next/headers'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default async function ProjectsAdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/sign-in')
  
  let projectsList = []

  try {
    projectsList = await db.select().from(projects)
  } catch (error) {
    console.error('Error loading projects:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your architectural projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projectsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No projects yet</p>
            <Link href="/admin/projects/new">
              <Button>Create First Project</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
              {projectsList.map((project) => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      {project.location && <span>📍 {project.location}</span>}
                      {project.completionDate && <span>📅 {new Date(project.completionDate).getFullYear()}</span>}
                      <span>{project.views || 0} views</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        if (confirm('Delete this project?')) {
                          // TODO: Add delete action
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    project.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
