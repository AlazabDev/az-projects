import { db } from '@/lib/db'
import { projects, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Projects | Architecture Portfolio',
  description: 'Explore our latest architectural projects and creations',
}

export default async function ProjectsPage() {
  let allProjects = []
  let allCategories = []
  
  try {
    allProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.status, 'published'))

    allCategories = await db.select().from(categories)
  } catch (error) {
    console.error('Error loading projects:', error)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover our portfolio of architectural excellence, showcasing innovative designs and transformative spaces.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {allProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No projects available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProjects.map(project => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {project.imageUrl && (
                      <div className="relative w-full h-64 bg-muted overflow-hidden">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="mb-3">
                        {project.categoryId && (
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {allCategories.find(c => c.id === project.categoryId)?.name || 'Project'}
                          </p>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        {project.location && (
                          <span className="text-muted-foreground">{project.location}</span>
                        )}
                        {project.projectType && (
                          <span className="text-muted-foreground">{project.projectType}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
