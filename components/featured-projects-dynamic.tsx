'use server'

import { db } from '@/lib/db'
import { projects, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export async function FeaturedProjectsSection() {
  try {
    const [featuredProjects, allCategories] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(eq(projects.featured, true))
        .limit(6),
      db.select().from(categories),
    ])

    if (featuredProjects.length === 0) {
      return null
    }

    return (
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our most remarkable architectural achievements and transformative designs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {project.imageUrl && (
                    <div className="relative w-full h-64 bg-muted overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    {project.categoryId && (
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        {allCategories.find((c) => c.id === project.categoryId)?.name ||
                          'Project'}
                      </p>
                    )}
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/projects">
              <Button size="lg" variant="outline">
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('[v0] Featured projects query failed:', error)
    return null
  }
}
