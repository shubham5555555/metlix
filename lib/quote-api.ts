// Quote API utilities
export interface CustomerInfo {
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

export interface QuoteItem {
  productId: string
  productName: string
  quantity: number
  selectedColor?: string
  customizations?: string
}

export interface ProjectDetails {
  projectType: "residential" | "commercial" | "hospitality"
  timeline: "immediate" | "1-3 months" | "3-6 months" | "6+ months"
  budget: "under-10k" | "10k-25k" | "25k-50k" | "50k-100k" | "100k+"
  description: string
  specialRequirements?: string
}

export interface QuoteRequest {
  customerInfo: CustomerInfo
  items: QuoteItem[]
  projectDetails: ProjectDetails
  preferredContactMethod: "email" | "phone" | "both"
  preferredContactTime?: string
}

export interface QuoteResponse {
  quoteId: string
  status: "submitted"
  estimatedResponse: string
  message: string
}

const API_BASE_URL = "http://192.168.1.13:3005/v1/api"

export async function submitQuoteRequest(quoteData: QuoteRequest): Promise<QuoteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteData),
    })

    if (!response.ok) {
      throw new Error(`Quote submission failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error submitting quote request:", error)
    throw error
  }
}

export async function getQuoteStatus(quoteId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/${quoteId}/status`)

    if (!response.ok) {
      throw new Error(`Failed to get quote status: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting quote status:", error)
    throw error
  }
}
