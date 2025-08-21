"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { submitQuoteRequest, type QuoteRequest } from "@/lib/api"
import { CheckCircle, Loader2, Mail, Phone, User, Building, MapPin, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export interface QuoteItem {
  productId: string
  productName: string
  quantity: number
  selectedColor?: string
  customizations?: string
}

interface QuoteFormProps {
  initialItems?: QuoteItem[]
  onSuccess?: (quoteId: string) => void
  onClose?: () => void
}

interface ValidationErrors {
  [key: string]: string
}

export function QuoteForm({ initialItems = [], onSuccess, onClose }: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [quoteId, setQuoteId] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [formData, setFormData] = useState<Partial<QuoteRequest>>({
    customerInfo: {
      name: "",
      email: "",
      phone: "+91 ",
      company: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
    },
    items: initialItems,
    projectDetails: {
      projectType: "residential",
      timeline: "1-3 months",
      budget: "25k-50k",
      description: "",
      specialRequirements: "",
    },
    preferredContactMethod: "email",
    preferredContactTime: "",
  })

  const steps = [
    { id: 1, title: "Contact Info" },
    { id: 2, title: "Address" },
    { id: 3, title: "Project Details" },
    { id: 4, title: "Preferences" },
    { id: 5, title: "Review" }
  ]

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Basic phone validation - allows numbers, spaces, parentheses, hyphens, and plus sign
    const phoneRegex = /^[+]?[0-9]{1,4}?[-\s./0-9]*$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {}
    
    if (step === 1) {
      if (!formData.customerInfo?.name?.trim()) {
        newErrors.name = "Name should not be empty"
      }
      if (!formData.customerInfo?.email?.trim()) {
        newErrors.email = "Email should not be empty"
      } else if (!validateEmail(formData.customerInfo.email)) {
        newErrors.email = "Email must be a valid email address"
      }
      if (!formData.customerInfo?.phone?.trim()) {
        newErrors.phone = "Phone should not be empty"
      } else if (!validatePhone(formData.customerInfo.phone)) {
        newErrors.phone = "Phone must be a valid phone number"
      }
    }
    
    if (step === 2) {
      if (!formData.customerInfo?.address?.street?.trim()) {
        newErrors.street = "Street address should not be empty"
      }
      if (!formData.customerInfo?.address?.city?.trim()) {
        newErrors.city = "City should not be empty"
      }
      if (!formData.customerInfo?.address?.state?.trim()) {
        newErrors.state = "State should not be empty"
      }
      if (!formData.customerInfo?.address?.zipCode?.trim()) {
        newErrors.zipCode = "ZIP code should not be empty"
      }
    }
    
    if (step === 3) {
      if (!formData.projectDetails?.description?.trim()) {
        newErrors.description = "Project description should not be empty"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all steps before submission
    let isValid = true
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        isValid = false
      }
    }
    
    if (!isValid) {
      // Jump to the first step with errors
      if (errors.name || errors.email || errors.phone) {
        setCurrentStep(1)
      } else if (errors.street || errors.city || errors.state || errors.zipCode) {
        setCurrentStep(2)
      } else if (errors.description) {
        setCurrentStep(3)
      }
      return
    }
    
    setIsSubmitting(true)

    try {
      const response = await submitQuoteRequest(formData as QuoteRequest)
      setQuoteId(response.quoteId)
      setIsSubmitted(true)
      onSuccess?.(response.quoteId)
    } catch (error) {
      console.error("Failed to submit quote:", error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateCustomerInfo = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo!,
        [field]: value,
      },
    }))
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateAddress = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo!,
        address: {
          ...prev.customerInfo!.address,
          [field]: value,
        },
      },
    }))
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateProjectDetails = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      projectDetails: {
        ...prev.projectDetails!,
        [field]: value,
      },
    }))
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Quote Request Submitted!</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Thank you for your interest. We'll review your request and get back to you within 24-48 hours.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Quote ID: <span className="font-mono font-medium">{quoteId}</span>
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={onClose} size="sm" className="w-full">
              Close
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Print Details
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`text-xs ${currentStep >= step.id ? 'font-bold' : 'text-muted-foreground'}`}
            >
              {step.id}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        <div className="text-xs text-center mt-2 text-muted-foreground">
          Step {currentStep} of {steps.length}: {steps[currentStep-1].title}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-xs">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.customerInfo?.name || ""}
                    onChange={(e) => updateCustomerInfo("name", e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                  {errors.name && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.customerInfo?.email || ""}
                    onChange={(e) => updateCustomerInfo("email", e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                  {errors.email && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">Phone Number *</Label>
                  <div className="flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customerInfo?.phone?.replace('+91 ', '') || ""}
                      onChange={(e) => updateCustomerInfo("phone", "+91 " + e.target.value.replace(/\D/g, ''))}
                      required
                      className="h-9 text-sm rounded-l-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="company" className="text-xs">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.customerInfo?.company || ""}
                    onChange={(e) => updateCustomerInfo("company", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Address */}
        {currentStep === 2 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Project Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street" className="text-xs">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.customerInfo?.address.street || ""}
                  onChange={(e) => updateAddress("street", e.target.value)}
                  required
                  className="h-9 text-sm"
                />
                {errors.street && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.street}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-xs">City *</Label>
                  <Input
                    id="city"
                    value={formData.customerInfo?.address.city || ""}
                    onChange={(e) => updateAddress("city", e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                  {errors.city && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="state" className="text-xs">State *</Label>
                  <Input
                    id="state"
                    value={formData.customerInfo?.address.state || ""}
                    onChange={(e) => updateAddress("state", e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                  {errors.state && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.state}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode" className="text-xs">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.customerInfo?.address.zipCode || ""}
                    onChange={(e) => updateAddress("zipCode", e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                  {errors.zipCode && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.zipCode}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="country" className="text-xs">Country *</Label>
                  <Select
                    value={formData.customerInfo?.address.country}
                    onValueChange={(value) => updateAddress("country", value)}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India" className="text-sm">India</SelectItem>
                      <SelectItem value="United States" className="text-sm">United States</SelectItem>
                      <SelectItem value="United Kingdom" className="text-sm">United Kingdom</SelectItem>
                      <SelectItem value="Canada" className="text-sm">Canada</SelectItem>
                      <SelectItem value="Australia" className="text-sm">Australia</SelectItem>
                      <SelectItem value="Other" className="text-sm">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Project Details */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Project Type *</Label>
                <RadioGroup
                  value={formData.projectDetails?.projectType}
                  onValueChange={(value) => updateProjectDetails("projectType", value)}
                  className="flex flex-col sm:flex-row gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="residential" id="residential" />
                    <Label htmlFor="residential" className="text-sm">Residential</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commercial" id="commercial" />
                    <Label htmlFor="commercial" className="text-sm">Commercial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hospitality" id="hospitality" />
                    <Label htmlFor="hospitality" className="text-sm">Hospitality</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline" className="text-xs">Timeline *</Label>
                  <Select
                    value={formData.projectDetails?.timeline}
                    onValueChange={(value) => updateProjectDetails("timeline", value)}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate" className="text-sm">Immediate (ASAP)</SelectItem>
                      <SelectItem value="1-3 months" className="text-sm">1-3 Months</SelectItem>
                      <SelectItem value="3-6 months" className="text-sm">3-6 Months</SelectItem>
                      <SelectItem value="6+ months" className="text-sm">6+ Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget" className="text-xs">Budget Range *</Label>
                  <Select
                    value={formData.projectDetails?.budget}
                    onValueChange={(value) => updateProjectDetails("budget", value)}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k" className="text-sm">Under ₹10k</SelectItem>
                      <SelectItem value="10k-25k" className="text-sm">₹10k-25k</SelectItem>
                      <SelectItem value="25k-50k" className="text-sm">₹25k-50k</SelectItem>
                      <SelectItem value="50k-100k" className="text-sm">₹50k-100k</SelectItem>
                      <SelectItem value="100k+" className="text-sm">₹100k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-xs">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, space requirements, style preferences..."
                  value={formData.projectDetails?.description || ""}
                  onChange={(e) => updateProjectDetails("description", e.target.value)}
                  rows={3}
                  required
                  className="text-sm"
                />
                {errors.description && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="specialRequirements" className="text-xs">Special Requirements (Optional)</Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special requirements or custom modifications..."
                  value={formData.projectDetails?.specialRequirements || ""}
                  onChange={(e) => updateProjectDetails("specialRequirements", e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Contact Preferences */}
        {currentStep === 4 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contact Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Preferred Contact Method *</Label>
                <RadioGroup
                  value={formData.preferredContactMethod}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredContactMethod: value as any }))}
                  className="flex flex-col sm:flex-row gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-contact" />
                    <Label htmlFor="email-contact" className="text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone-contact" />
                    <Label htmlFor="phone-contact" className="text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both-contact" />
                    <Label htmlFor="both-contact" className="text-sm">Both</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="contactTime" className="text-xs">Preferred Contact Time (Optional)</Label>
                <Input
                  id="contactTime"
                  placeholder="e.g., Weekdays 9AM-5PM IST"
                  value={formData.preferredContactTime || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferredContactTime: e.target.value }))}
                  className="h-9 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Review Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Contact Information</h3>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{formData.customerInfo?.name}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div>{formData.customerInfo?.email}</div>
                  <div className="text-muted-foreground">Phone:</div>
                  <div>{formData.customerInfo?.phone}</div>
                  <div className="text-muted-foreground">Company:</div>
                  <div>{formData.customerInfo?.company || "N/A"}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm">Address</h3>
                <div className="text-sm">
                  <div>{formData.customerInfo?.address.street}</div>
                  <div>{formData.customerInfo?.address.city}, {formData.customerInfo?.address.state} {formData.customerInfo?.address.zipCode}</div>
                  <div>{formData.customerInfo?.address.country}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm">Project Details</h3>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Type:</div>
                  <div className="capitalize">{formData.projectDetails?.projectType}</div>
                  <div className="text-muted-foreground">Timeline:</div>
                  <div>{formData.projectDetails?.timeline}</div>
                  <div className="text-muted-foreground">Budget:</div>
                  <div>{formData.projectDetails?.budget}</div>
                </div>
                <div className="mt-2">
                  <div className="text-muted-foreground text-sm">Description:</div>
                  <div className="text-sm mt-1">{formData.projectDetails?.description}</div>
                </div>
                {formData.projectDetails?.specialRequirements && (
                  <div className="mt-2">
                    <div className="text-muted-foreground text-sm">Special Requirements:</div>
                    <div className="text-sm mt-1">{formData.projectDetails.specialRequirements}</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm">Contact Preferences</h3>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Method:</div>
                  <div className="capitalize">{formData.preferredContactMethod}</div>
                  <div className="text-muted-foreground">Preferred Time:</div>
                  <div>{formData.preferredContactTime || "Any time"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 flex-col sm:flex-row gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="flex items-center gap-1 order-2 sm:order-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="flex items-center gap-1 order-1 sm:order-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="min-w-28 order-1 sm:order-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quote"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}