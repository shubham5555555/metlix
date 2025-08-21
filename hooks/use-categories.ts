"use client"

import { useState, useEffect } from "react"
import { fetchCategories, fetchCategoryBySlug, type Category } from "@/lib/api"

interface UseCategoriesReturn {
  categories: Category[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories")
      setCategories([])
      console.error("Categories fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchData,
  }
}

interface UseCategoryReturn {
  category: Category | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCategory(slug: string): UseCategoryReturn {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchCategoryBySlug(slug)
      setCategory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch category")
      setCategory(null)
      console.error("Category fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchData()
    }
  }, [slug])

  return {
    category,
    loading,
    error,
    refetch: fetchData,
  }
}
