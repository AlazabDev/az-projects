import { db } from '@/lib/db'
import { projects, projectMedia, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, MapPin, Users, Ruler, DollarSign, Calendar } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, params.slug))
      .limit(1)

    if (!project.length) return { title: 'Project not found' }

    return {
      title: `${project[0].title} | Architecture Portfolio`,
      description: project[0].description,
    }
  } catch (error) {
    console.error('[v0] Error generating metadata:', error)
    return { title: 'Project not found' }
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  try {
    const projectList = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, params.slug))
      .limit(1)

    if (!projectList.length) {
      notFound()
    }

    const project = projectList[0]

    // Get media files
    const media = await db
      .select()
      .from(projectMedia)
      .where(eq(projectMedia.projectId, project.id))

    // Get category
    const categoryList = project.categoryId
      ? await db
          .select()
          .from(categories)
          .where(eq(categories.id, project.categoryId))
          .limit(1)
      : []

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Link href="/projects" className="inline-flex items-center text-sm hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      {project.imageUrl && (
        <section className="relative w-full h-96 md:h-[500px] bg-muted overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </section>
      )}

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {categoryList.length > 0 && (
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  {categoryList[0].name}
                </p>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{project.title}</h1>
              <p className="text-lg text-muted-foreground mb-8">{project.description}</p>

              {project.longDescription && (
                <div className="prose prose-sm max-w-none mb-12 text-foreground">
                  <p className="whitespace-pre-wrap">{project.longDescription}</p>
                </div>
              )}

              {/* Media Gallery */}
              {media.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {media.map(item => (
                      <div key={item.id} className="relative w-full h-80 bg-muted rounded-lg overflow-hidden">
                        {item.type === 'image' && (
                          <Image
                            src={item.url}
                            alt={item.altText || item.title || 'Project image'}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Team Members */}
              {project.teamMembers && project.teamMembers.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Team</h2>
                  <p className="text-muted-foreground">{project.teamMembers.join(', ')}</p>
                </section>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Technologies & Materials</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Awards */}
              {project.awards && project.awards.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Awards & Recognition</h2>
                  <ul className="space-y-2">
                    {project.awards.map(award => (
                      <li key={award} className="text-muted-foreground flex items-start">
                        <span className="mr-3">•</span>
                        {award}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">Project Details</h3>
                  </div>

                  {project.location && (
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Location</p>
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      </div>
                    </div>
                  )}

                  {project.projectType && (
                    <div className="flex items-start gap-4">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Type</p>
                        <p className="text-sm text-muted-foreground">{project.projectType}</p>
                      </div>
                    </div>
                  )}

                  {project.areaSqm && (
                    <div className="flex items-start gap-4">
                      <Ruler className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Area</p>
                        <p className="text-sm text-muted-foreground">{project.areaSqm} sqm</p>
                      </div>
                    </div>
                  )}

                  {project.budget && (
                    <div className="flex items-start gap-4">
                      <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Budget</p>
                        <p className="text-sm text-muted-foreground">${parseFloat(project.budget.toString()).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {project.completionDate && (
                    <div className="flex items-start gap-4">
                      <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.completionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {project.clientName && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm font-medium text-foreground mb-1">Client</p>
                      <p className="text-sm text-muted-foreground">{project.clientName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Link href="/projects">
            <Button variant="outline">View All Projects</Button>
          </Link>
        </div>
      </section>
    </main>
    )
  } catch (error) {
    console.error('[v0] Error loading project:', error)
    notFound()
  }
}
