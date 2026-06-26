import { pgTable, text, timestamp, boolean, uuid, varchar, decimal, integer, jsonb, date } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

// --- Portfolio Tables ---

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: text('userId').notNull(),
})

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  categoryId: uuid('category_id'),
  featured: boolean('featured').default(false),
  imageUrl: varchar('image_url', { length: 500 }),
  galleryImages: text('gallery_images').array(),
  status: varchar('status', { length: 50 }).default('published'),
  location: varchar('location', { length: 255 }),
  completionDate: date('completion_date'),
  clientName: varchar('client_name', { length: 255 }),
  projectType: varchar('project_type', { length: 100 }),
  areaSqm: decimal('area_sqm', { precision: 10, scale: 2 }),
  budget: decimal('budget', { precision: 12, scale: 2 }),
  teamMembers: text('team_members').array(),
  technologies: text('technologies').array(),
  awards: text('awards').array(),
  views: integer('views').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: text('userId').notNull(),
})

export const projectMedia = pgTable('project_media', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  type: varchar('type', { length: 50 }).default('image'),
  title: varchar('title', { length: 255 }),
  altText: varchar('alt_text', { length: 255 }),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: text('userId').notNull(),
})

export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id'),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  clientTitle: varchar('client_title', { length: 255 }),
  clientCompany: varchar('client_company', { length: 255 }),
  clientImage: varchar('client_image', { length: 500 }),
  content: text('content').notNull(),
  rating: integer('rating'),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  userId: text('userId').notNull(),
})

export const portfolioSettings = pgTable('portfolio_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: varchar('company_name', { length: 255 }),
  companyDescription: text('company_description'),
  companyLogo: varchar('company_logo', { length: 500 }),
  companyEmail: varchar('company_email', { length: 255 }),
  companyPhone: varchar('company_phone', { length: 20 }),
  companyAddress: text('company_address'),
  socialLinks: jsonb('social_links'),
  heroTitle: varchar('hero_title', { length: 500 }),
  heroSubtitle: text('hero_subtitle'),
  heroImage: varchar('hero_image', { length: 500 }),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  seoKeywords: varchar('seo_keywords', { length: 500 }),
  themePrimaryColor: varchar('theme_primary_color', { length: 7 }),
  themeSecondaryColor: varchar('theme_secondary_color', { length: 7 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userId: text('userId').notNull(),
})
