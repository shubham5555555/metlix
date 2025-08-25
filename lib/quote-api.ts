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
  message: string
  source: string
  quoteId: string
  customerInfo: CustomerInfo
  items: QuoteItem[]
  projectDetails: ProjectDetails
  preferredContactMethod: string
  preferredContactTime?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface QuoteStatus {
  quoteId: string
  status: "pending" | "reviewed" | "accepted" | "rejected" | "completed"
  estimatedResponse?: string
  message?: string
  lastUpdated: string
}

export interface ApiResponse<T> {
  status: number
  message: string
  data?: T
  error?: string
}

const API_BASE_URL = "http://localhost:3005/v1/api"

// Helper function to transform the MongoDB response to our QuoteResponse format
function transformQuoteResponse(response: any): QuoteResponse {
  const { _doc, _id, ...rest } = response;
  
  return {
    message: rest.message,
    source: rest.source,
    quoteId: _id || _doc._id,
    customerInfo: _doc.customerInfo,
    items: _doc.items,
    projectDetails: _doc.projectDetails,
    preferredContactMethod: _doc.preferredContactMethod,
    preferredContactTime: _doc.preferredContactTime,
    status: _doc.status,
    createdAt: _doc.createdAt,
    updatedAt: _doc.updatedAt
  };
}

export async function submitQuoteRequest(quoteData: QuoteRequest): Promise<ApiResponse<QuoteResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteData),
    })

    const responseData = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        message: "Quote submission failed",
        error: responseData.message || response.statusText
      }
    }

    const transformedData = transformQuoteResponse(responseData)
    
    return {
      status: response.status,
      message: "Quote submitted successfully",
      data: transformedData
    }
  } catch (error) {
    console.error("Error submitting quote request:", error)
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function getQuoteStatus(quoteId: string): Promise<ApiResponse<QuoteStatus>> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/${quoteId}/status`)

    if (!response.ok) {
      const errorData = await response.json()
      return {
        status: response.status,
        message: "Failed to get quote status",
        error: errorData.message || response.statusText
      }
    }

    const responseData = await response.json()
    
    // Transform the response if needed
    const quoteStatus: QuoteStatus = {
      quoteId: responseData._id || quoteId,
      status: responseData.status,
      estimatedResponse: responseData.estimatedResponse,
      message: responseData.message,
      lastUpdated: responseData.updatedAt || new Date().toISOString()
    }

    return {
      status: response.status,
      message: "Quote status retrieved successfully",
      data: quoteStatus
    }
  } catch (error) {
    console.error("Error getting quote status:", error)
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function getAllQuotes(): Promise<ApiResponse<QuoteResponse[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes`)

    if (!response.ok) {
      const errorData = await response.json()
      return {
        status: response.status,
        message: "Failed to get quotes",
        error: errorData.message || response.statusText
      }
    }

    const responseData = await response.json()
    
    // Transform each quote in the response
    const quotes: QuoteResponse[] = Array.isArray(responseData) 
      ? responseData.map(transformQuoteResponse)
      : [transformQuoteResponse(responseData)]

    return {
      status: response.status,
      message: "Quotes retrieved successfully",
      data: quotes
    }
  } catch (error) {
    console.error("Error getting quotes:", error)
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function updateQuoteStatus(
  quoteId: string, 
  status: "pending" | "reviewed" | "accepted" | "rejected" | "completed"
): Promise<ApiResponse<QuoteStatus>> {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/${quoteId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        status: response.status,
        message: "Failed to update quote status",
        error: errorData.message || response.statusText
      }
    }

    const responseData = await response.json()
    
    const quoteStatus: QuoteStatus = {
      quoteId: responseData._id || quoteId,
      status: responseData.status,
      estimatedResponse: responseData.estimatedResponse,
      message: responseData.message,
      lastUpdated: responseData.updatedAt || new Date().toISOString()
    }

    return {
      status: response.status,
      message: "Quote status updated successfully",
      data: quoteStatus
    }
  } catch (error) {
    console.error("Error updating quote status:", error)
    return {
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

// Example usage:
/*
async function exampleUsage() {
  // Submit a quote
  const quoteData: QuoteRequest = {
    customerInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA"
      }
    },
    items: [
      {
        productId: "68a4394d100acaf3e3e653eb",
        productName: "plate",
        quantity: 1
      }
    ],
    projectDetails: {
      projectType: "residential",
      timeline: "1-3 months",
      budget: "25k-50k",
      description: "Sample project description"
    },
    preferredContactMethod: "email"
  };
  
  const submissionResult = await submitQuoteRequest(quoteData);
  if (submissionResult.data) {
    console.log("Quote submitted:", submissionResult.data.quoteId);
    
    // Get status
    const statusResult = await getQuoteStatus(submissionResult.data.quoteId);
    if (statusResult.data) {
      console.log("Quote status:", statusResult.data.status);
    }
  }
}
*/