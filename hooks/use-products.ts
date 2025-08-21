"use client"

import { useState, useEffect } from "react"
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsBySubcategory,
  fetchProductBySlug,
  type Product,
  type ProductsListParams,
} from "@/lib/api"

export function useProducts(params: ProductsListParams = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts(params)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [JSON.stringify(params)])

  const retry = () => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts(params)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }

  return { products, loading, error, retry }
}

export function useProductsByCategory(category: string, limit?: number, page?: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductsByCategory(category, limit, page)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category, limit, page])

  const retry = () => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductsByCategory(category, limit, page)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }

  return { products, loading, error, retry }
}

export function useProductsBySubcategory(subcategory: string, limit?: number, page?: number) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductsBySubcategory(subcategory, limit, page)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [subcategory, limit, page])

  const retry = () => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductsBySubcategory(subcategory, limit, page)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }

  return { products, loading, error, retry }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductBySlug(slug)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadProduct()
    }
  }, [slug])

  const retry = () => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductBySlug(slug)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product")
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }

  return { product, loading, error, retry }
}
