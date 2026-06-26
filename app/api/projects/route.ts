import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const body = await request.json()

    const newProject = await db.insert(projects).values({
      title: body.title,
      slug: body.slug,
      description: body.description,
      longDescription: body.longDescription || null,
      featured: body.featured || false,
      imageUrl: body.imageUrl || null,
      status: body.status || 'published',
      location: body.location || null,
      completionDate: body.completionDate ? new Date(body.completionDate) : null,
      clientName: body.clientName || null,
      projectType: body.projectType || null,
      areaSqm: body.areaSqm ? parseFloat(body.areaSqm) : null,
      budget: body.budget ? parseFloat(body.budget) : null,
      userId,
    }).returning()

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/projects error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const projectsList = await db.select().from(projects)
    return NextResponse.json(projectsList)
  } catch (error) {
    console.error('[v0] GET /api/projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
