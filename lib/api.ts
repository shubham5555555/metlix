export interface ApiResponse<T> {
  status: number
  message: string
  source: string
  data: T
}

export interface ApiCategory {
  _id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  subcategories: string[]
  __v: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  subcategories?: string[]
}

const API_BASE_URL = "http://192.168.1.13:3005/v1/api"

export async function fetchCategories(): Promise<Category[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const response = await fetch(`${API_BASE_URL}/categories/list`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse: ApiResponse<ApiCategory[]> = await response.json()

    if (apiResponse.status !== 200) {
      throw new Error(`API error: ${apiResponse.message}`)
    }

    // Transform API data to match our internal Category interface
    return apiResponse.data.map(
      (apiCategory: ApiCategory): Category => ({
        id: apiCategory._id,
        name: apiCategory.name,
        slug: apiCategory.slug,
        description: apiCategory.description,
        image: apiCategory.image,
        productCount: apiCategory.productCount,
        subcategories: apiCategory.subcategories,
      }),
    )
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await fetchCategories()
  return categories.find((category) => category.slug === slug) || null
}

export interface ApiProduct {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  features: string[]
  dimensions: {
    width: number
    height: number
    depth: number
    unit: string
  }
  materials: string[]
  colors: string[]
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
  rating: number
  reviewCount: number
  __v?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  features: string[]
  dimensions: {
    width: number
    height: number
    depth: number
    unit: string
  }
  materials: string[]
  colors: string[]
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
  rating: number
  reviewCount: number
}

export interface ProductsListParams {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "rating_desc"
  min_price?: number
  max_price?: number
}

export interface ProductsApiResponse {
  products: ApiProduct[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function fetchProducts(params: ProductsListParams = {}): Promise<Product[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const response = await fetch(`${API_BASE_URL}/products/list?${searchParams}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse: ApiResponse<ProductsApiResponse> = await response.json()

    if (apiResponse.status !== 200) {
      throw new Error(`API error: ${apiResponse.message}`)
    }

    return apiResponse.data.products.map(
      (apiProduct: ApiProduct): Product => ({
        id: apiProduct._id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        description: apiProduct.description,
        price: apiProduct.price,
        originalPrice: apiProduct.originalPrice,
        category: apiProduct.category,
        subcategory: apiProduct.subcategory,
        images: apiProduct.images,
        features: apiProduct.features,
        dimensions: apiProduct.dimensions,
        materials: apiProduct.materials,
        colors: apiProduct.colors,
        inStock: apiProduct.inStock,
        isNew: apiProduct.isNew,
        isFeatured: apiProduct.isFeatured,
        rating: apiProduct.rating,
        reviewCount: apiProduct.reviewCount,
      }),
    )
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function fetchProductsByCategory(category: string, limit?: number, page?: number): Promise<Product[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const searchParams = new URLSearchParams()
    if (limit) searchParams.append("limit", limit.toString())
    if (page) searchParams.append("page", page.toString())

    const response = await fetch(`${API_BASE_URL}/products/category/${category}?${searchParams}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse: ApiResponse<ProductsApiResponse> = await response.json()

    if (apiResponse.status !== 200) {
      throw new Error(`API error: ${apiResponse.message}`)
    }

    return apiResponse.data.products.map(
      (apiProduct: ApiProduct): Product => ({
        id: apiProduct._id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        description: apiProduct.description,
        price: apiProduct.price,
        originalPrice: apiProduct.originalPrice,
        category: apiProduct.category,
        subcategory: apiProduct.subcategory,
        images: apiProduct.images,
        features: apiProduct.features,
        dimensions: apiProduct.dimensions,
        materials: apiProduct.materials,
        colors: apiProduct.colors,
        inStock: apiProduct.inStock,
        isNew: apiProduct.isNew,
        isFeatured: apiProduct.isFeatured,
        rating: apiProduct.rating,
        reviewCount: apiProduct.reviewCount,
      }),
    )
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Failed to fetch products by category: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function fetchProductsBySubcategory(
  subcategory: string,
  limit?: number,
  page?: number,
): Promise<Product[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const searchParams = new URLSearchParams()
    if (limit) searchParams.append("limit", limit.toString())
    if (page) searchParams.append("page", page.toString())

    const response = await fetch(`${API_BASE_URL}/products/subcategory/${subcategory}?${searchParams}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse: ApiResponse<ApiProduct[]> = await response.json()

    if (apiResponse.status !== 200) {
      throw new Error(`API error: ${apiResponse.message}`)
    }

    return apiResponse.data.map(
      (apiProduct: ApiProduct): Product => ({
        id: apiProduct._id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        description: apiProduct.description,
        price: apiProduct.price,
        originalPrice: apiProduct.originalPrice,
        category: apiProduct.category,
        subcategory: apiProduct.subcategory,
        images: apiProduct.images,
        features: apiProduct.features,
        dimensions: apiProduct.dimensions,
        materials: apiProduct.materials,
        colors: apiProduct.colors,
        inStock: apiProduct.inStock,
        isNew: apiProduct.isNew,
        isFeatured: apiProduct.isFeatured,
        rating: apiProduct.rating,
        reviewCount: apiProduct.reviewCount,
      }),
    )
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(
      `Failed to fetch products by subcategory: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse: ApiResponse<ApiProduct> = await response.json()

    if (apiResponse.status !== 200) {
      throw new Error(`API error: ${apiResponse.message}`)
    }

    const apiProduct = apiResponse.data
    return {
      id: apiProduct._id,
      name: apiProduct.name,
      slug: apiProduct.slug,
      description: apiProduct.description,
      price: apiProduct.price,
      originalPrice: apiProduct.originalPrice,
      category: apiProduct.category,
      subcategory: apiProduct.subcategory,
      images: apiProduct.images,
      features: apiProduct.features,
      dimensions: apiProduct.dimensions,
      materials: apiProduct.materials,
      colors: apiProduct.colors,
      inStock: apiProduct.inStock,
      isNew: apiProduct.isNew,
      isFeatured: apiProduct.isFeatured,
      rating: apiProduct.rating,
      reviewCount: apiProduct.reviewCount,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Failed to fetch product by slug: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export interface QuoteRequest {
  customerInfo: {
    name: string
    email: string
    phone: string
    company?: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  items: Array<{
    productId: string
    productName: string
    quantity: number
    selectedColor?: string
    customizations?: string
  }>
  projectDetails: {
    projectType: "residential" | "commercial" | "hospitality"
    timeline: string
    budget: string
    description: string
    specialRequirements?: string
  }
  preferredContactMethod: "email" | "phone" | "both"
  preferredContactTime?: string
}

export interface QuoteResponse {
  status: number
  message: string
  data: {
    quoteId: string
    estimatedResponse: string
  }
}

export async function submitQuoteRequest(quoteData: QuoteRequest): Promise<{ quoteId: string }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout for quote submission

  try {
    const response = await fetch(`${API_BASE_URL}/quotes/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse: QuoteResponse = await response.json()

    if (apiResponse.status !== 201) {
      throw new Error(`API error: ${apiResponse.message}`)
    }

    return { quoteId: apiResponse.data.quoteId }
  } catch (error) {
    clearTimeout(timeoutId)
    throw new Error(`Failed to submit quote request: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
