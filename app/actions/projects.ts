'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { projects, categories, projectMedia, testimonials } from '@/lib/db/schema'
import { and, desc, eq, like, ilike } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Projects
export async function getProjects(status?: string) {
  const userId = await getUserId()
  const query = db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt))
  
  if (status) {
    return await query.where(eq(projects.status, status))
  }
  return await query
}

export async function getProjectBySlug(slug: string) {
  return await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1)
}

export async function createProject(data: {
  title: string
  slug: string
  description: string
  categoryId?: string
  longDescription?: string
  location?: string
  clientName?: string
  projectType?: string
  areaSqm?: string
  budget?: string
}) {
  const userId = await getUserId()
  
  const newProject = await db
    .insert(projects)
    .values({
      ...data,
      userId,
      areaSqm: data.areaSqm ? parseFloat(data.areaSqm) : undefined,
      budget: data.budget ? parseFloat(data.budget) : undefined,
    })
    .returning()
  
  revalidatePath('/admin/projects')
  return newProject[0]
}

export async function updateProject(id: string, data: Partial<typeof projects.$inferInsert>) {
  const userId = await getUserId()
  
  const updated = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning()
  
  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${data.slug}`)
  return updated[0]
}

export async function deleteProject(id: string) {
  const userId = await getUserId()
  
  await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)))
  
  revalidatePath('/admin/projects')
  return { success: true }
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  const userId = await getUserId()
  
  const updated = await db
    .update(projects)
    .set({ featured })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning()
  
  revalidatePath('/admin/projects')
  revalidatePath('/')
  return updated[0]
}

// Categories
export async function getCategories() {
  const userId = await getUserId()
  return await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy((cat) => cat.orderIndex)
}

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  icon?: string
}) {
  const userId = await getUserId()
  
  const newCategory = await db
    .insert(categories)
    .values({ ...data, userId })
    .returning()
  
  revalidatePath('/admin/categories')
  return newCategory[0]
}

export async function updateCategory(id: string, data: Partial<typeof categories.$inferInsert>) {
  const userId = await getUserId()
  
  const updated = await db
    .update(categories)
    .set(data)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .returning()
  
  revalidatePath('/admin/categories')
  return updated[0]
}

export async function deleteCategory(id: string) {
  const userId = await getUserId()
  
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId)))
  
  revalidatePath('/admin/categories')
  return { success: true }
}

// Project Media
export async function addProjectMedia(data: {
  projectId: string
  url: string
  type?: string
  title?: string
  altText?: string
}) {
  const userId = await getUserId()
  
  const newMedia = await db
    .insert(projectMedia)
    .values({ ...data, userId })
    .returning()
  
  revalidatePath(`/projects/${data.projectId}`)
  return newMedia[0]
}

export async function updateProjectMedia(id: string, data: Partial<typeof projectMedia.$inferInsert>) {
  const userId = await getUserId()
  
  const updated = await db
    .update(projectMedia)
    .set(data)
    .where(and(eq(projectMedia.id, id), eq(projectMedia.userId, userId)))
    .returning()
  
  revalidatePath(`/admin/projects`)
  return updated[0]
}

export async function deleteProjectMedia(id: string) {
  const userId = await getUserId()
  
  await db.delete(projectMedia).where(and(eq(projectMedia.id, id), eq(projectMedia.userId, userId)))
  
  revalidatePath('/admin/projects')
  return { success: true }
}

// Testimonials
export async function getTestimonials() {
  const userId = await getUserId()
  return await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.userId, userId))
    .orderBy(desc(testimonials.createdAt))
}

export async function getFeaturedTestimonials() {
  const userId = await getUserId()
  return await db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.userId, userId), eq(testimonials.featured, true)))
    .limit(5)
}

export async function createTestimonial(data: {
  projectId?: string
  clientName: string
  clientTitle?: string
  clientCompany?: string
  clientImage?: string
  content: string
  rating?: number
}) {
  const userId = await getUserId()
  
  const newTestimonial = await db
    .insert(testimonials)
    .values({ ...data, userId })
    .returning()
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return newTestimonial[0]
}

export async function updateTestimonial(id: string, data: Partial<typeof testimonials.$inferInsert>) {
  const userId = await getUserId()
  
  const updated = await db
    .update(testimonials)
    .set(data)
    .where(and(eq(testimonials.id, id), eq(testimonials.userId, userId)))
    .returning()
  
  revalidatePath('/admin/testimonials')
  revalidatePath('/')
  return updated[0]
}

export async function deleteTestimonial(id: string) {
  const userId = await getUserId()
  
  await db.delete(testimonials).where(and(eq(testimonials.id, id), eq(testimonials.userId, userId)))
  
  revalidatePath('/admin/testimonials')
  return { success: true }
}
