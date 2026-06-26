'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    featured: false,
    imageUrl: '',
    status: 'published',
    location: '',
    completionDate: '',
    clientName: '',
    projectType: '',
    areaSqm: '',
    budget: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/projects')
        router.refresh()
      } else {
        alert('Failed to create project')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Add a new architectural project to your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Project Title *</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Modern Office Complex"
                  required
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="modern-office-complex"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Description *</Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the project"
                className="w-full h-24 px-3 py-2 border border-input rounded-md text-sm"
                required
              />
            </div>

            <div>
              <Label>Long Description</Label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                placeholder="Detailed project description"
                className="w-full h-32 px-3 py-2 border border-input rounded-md text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Location</Label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label>Completion Date</Label>
                <Input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Client name"
                />
              </div>
              <div>
                <Label>Project Type</Label>
                <Input
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  placeholder="Residential, Commercial, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Area (m²)</Label>
                <Input
                  type="number"
                  name="areaSqm"
                  value={formData.areaSqm}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Budget</Label>
                <Input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label>Featured Image URL</Label>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <Label htmlFor="featured" className="font-normal cursor-pointer">
                Feature this project on homepage
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
              <Link href="/admin/projects">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
