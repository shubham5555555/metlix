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
        newErrors.name = "Name is required"
      }
      if (!formData.customerInfo?.email?.trim()) {
        newErrors.email = "Email is required"
      } else if (!validateEmail(formData.customerInfo.email)) {
        newErrors.email = "Please enter a valid email address"
      }
      if (!formData.customerInfo?.phone?.trim()) {
        newErrors.phone = "Phone number is required"
      } else if (!validatePhone(formData.customerInfo.phone)) {
        newErrors.phone = "Please enter a valid phone number"
      }
    }
    
    if (step === 2) {
      if (!formData.customerInfo?.address?.street?.trim()) {
        newErrors.street = "Street address is required"
      }
      if (!formData.customerInfo?.address?.city?.trim()) {
        newErrors.city = "City is required"
      }
      if (!formData.customerInfo?.address?.state?.trim()) {
        newErrors.state = "State is required"
      }
      if (!formData.customerInfo?.address?.zipCode?.trim()) {
        newErrors.zipCode = "ZIP code is required"
      }
    }
    
    if (step === 3) {
      if (!formData.projectDetails?.description?.trim()) {
        newErrors.description = "Project description is required"
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
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Quote Request Submitted!</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Thank you for your interest. We'll review your request and get back to you within 24-48 hours.
          </p>
          <div className="bg-muted p-3 rounded-md mb-4">
            <p className="text-xs text-muted-foreground">
              Quote ID: <span className="font-mono font-medium text-foreground">{quoteId}</span>
            </p>
          </div>
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`text-xs ${currentStep >= step.id ? 'font-bold text-primary' : 'text-muted-foreground'}`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        <div className="text-xs text-center mt-2 text-muted-foreground">
          Step {currentStep} of {steps.length}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <Card className="w-full shadow-md">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium mb-2 block">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.customerInfo?.name || ""}
                    onChange={(e) => updateCustomerInfo("name", e.target.value)}
                    required
                    className="h-10 text-sm"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.customerInfo?.email || ""}
                    onChange={(e) => updateCustomerInfo("email", e.target.value)}
                    required
                    className="h-10 text-sm"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-2 block">Phone Number *</Label>
                  <div className="flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted text-sm h-10">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customerInfo?.phone?.replace('+91 ', '') || ""}
                      onChange={(e) => updateCustomerInfo("phone", "+91 " + e.target.value.replace(/\D/g, ''))}
                      required
                      className="h-10 text-sm rounded-l-none"
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
                  <Label htmlFor="company" className="text-sm font-medium mb-2 block">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.customerInfo?.company || ""}
                    onChange={(e) => updateCustomerInfo("company", e.target.value)}
                    className="h-10 text-sm"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Address */}
        {currentStep === 2 && (
          <Card className="w-full shadow-md">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Project Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="street" className="text-sm font-medium mb-2 block">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.customerInfo?.address.street || ""}
                  onChange={(e) => updateAddress("street", e.target.value)}
                  required
                  className="h-10 text-sm"
                  placeholder="Enter your street address"
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
                  <Label htmlFor="city" className="text-sm font-medium mb-2 block">City *</Label>
                  <Input
                    id="city"
                    value={formData.customerInfo?.address.city || ""}
                    onChange={(e) => updateAddress("city", e.target.value)}
                    required
                    className="h-10 text-sm"
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium mb-2 block">State *</Label>
                  <Input
                    id="state"
                    value={formData.customerInfo?.address.state || ""}
                    onChange={(e) => updateAddress("state", e.target.value)}
                    required
                    className="h-10 text-sm"
                    placeholder="Enter your state"
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
                  <Label htmlFor="zipCode" className="text-sm font-medium mb-2 block">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.customerInfo?.address.zipCode || ""}
                    onChange={(e) => updateAddress("zipCode", e.target.value)}
                    required
                    className="h-10 text-sm"
                    placeholder="Enter your ZIP code"
                  />
                  {errors.zipCode && (
                    <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.zipCode}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="country" className="text-sm font-medium mb-2 block">Country *</Label>
                  <Select
                    value={formData.customerInfo?.address.country}
                    onValueChange={(value) => updateAddress("country", value)}
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select country" />
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
          <Card className="w-full shadow-md">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Project Type *</Label>
                <RadioGroup
                  value={formData.projectDetails?.projectType}
                  onValueChange={(value) => updateProjectDetails("projectType", value)}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent">
                    <RadioGroupItem value="residential" id="residential" />
                    <Label htmlFor="residential" className="text-sm cursor-pointer">Residential</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent">
                    <RadioGroupItem value="commercial" id="commercial" />
                    <Label htmlFor="commercial" className="text-sm cursor-pointer">Commercial</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent">
                    <RadioGroupItem value="hospitality" id="hospitality" />
                    <Label htmlFor="hospitality" className="text-sm cursor-pointer">Hospitality</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeline" className="text-sm font-medium mb-2 block">Timeline *</Label>
                  <Select
                    value={formData.projectDetails?.timeline}
                    onValueChange={(value) => updateProjectDetails("timeline", value)}
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select timeline" />
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
                  <Label htmlFor="budget" className="text-sm font-medium mb-2 block">Budget Range *</Label>
                  <Select
                    value={formData.projectDetails?.budget}
                    onValueChange={(value) => updateProjectDetails("budget", value)}
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select budget range" />
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
                <Label htmlFor="description" className="text-sm font-medium mb-2 block">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, space requirements, style preferences..."
                  value={formData.projectDetails?.description || ""}
                  onChange={(e) => updateProjectDetails("description", e.target.value)}
                  rows={4}
                  required
                  className="text-sm resize-vertical"
                />
                {errors.description && (
                  <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="specialRequirements" className="text-sm font-medium mb-2 block">Special Requirements (Optional)</Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special requirements or custom modifications..."
                  value={formData.projectDetails?.specialRequirements || ""}
                  onChange={(e) => updateProjectDetails("specialRequirements", e.target.value)}
                  rows={3}
                  className="text-sm resize-vertical"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Contact Preferences */}
        {currentStep === 4 && (
          <Card className="w-full shadow-md">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Contact Preferences</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Preferred Contact Method *</Label>
                <RadioGroup
                  value={formData.preferredContactMethod}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredContactMethod: value as any }))}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent">
                    <RadioGroupItem value="email" id="email-contact" />
                    <Label htmlFor="email-contact" className="text-sm flex items-center gap-2 cursor-pointer">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent">
                    <RadioGroupItem value="phone" id="phone-contact" />
                    <Label htmlFor="phone-contact" className="text-sm flex items-center gap-2 cursor-pointer">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent">
                    <RadioGroupItem value="both" id="both-contact" />
                    <Label htmlFor="both-contact" className="text-sm cursor-pointer">Both</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="contactTime" className="text-sm font-medium mb-2 block">Preferred Contact Time (Optional)</Label>
                <Input
                  id="contactTime"
                  placeholder="e.g., Weekdays 9AM-5PM IST"
                  value={formData.preferredContactTime || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferredContactTime: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <Card className="w-full shadow-md">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Review Your Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium text-base border-b pb-2">Contact Information</h3>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="text-muted-foreground">Name:</div>
                  <div className="font-medium">{formData.customerInfo?.name}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div className="font-medium">{formData.customerInfo?.email}</div>
                  <div className="text-muted-foreground">Phone:</div>
                  <div className="font-medium">{formData.customerInfo?.phone}</div>
                  <div className="text-muted-foreground">Company:</div>
                  <div className="font-medium">{formData.customerInfo?.company || "N/A"}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-base border-b pb-2">Address</h3>
                <div className="text-sm">
                  <div className="font-medium">{formData.customerInfo?.address.street}</div>
                  <div className="text-muted-foreground">{formData.customerInfo?.address.city}, {formData.customerInfo?.address.state} {formData.customerInfo?.address.zipCode}</div>
                  <div className="text-muted-foreground">{formData.customerInfo?.address.country}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-base border-b pb-2">Project Details</h3>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="text-muted-foreground">Type:</div>
                  <div className="font-medium capitalize">{formData.projectDetails?.projectType}</div>
                  <div className="text-muted-foreground">Timeline:</div>
                  <div className="font-medium">{formData.projectDetails?.timeline}</div>
                  <div className="text-muted-foreground">Budget:</div>
                  <div className="font-medium">{formData.projectDetails?.budget}</div>
                </div>
                <div className="mt-3">
                  <div className="text-muted-foreground text-sm mb-1">Description:</div>
                  <div className="text-sm p-3 bg-muted rounded-md">{formData.projectDetails?.description}</div>
                </div>
                {formData.projectDetails?.specialRequirements && (
                  <div className="mt-3">
                    <div className="text-muted-foreground text-sm mb-1">Special Requirements:</div>
                    <div className="text-sm p-3 bg-muted rounded-md">{formData.projectDetails.specialRequirements}</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-base border-b pb-2">Contact Preferences</h3>
                <div className="text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="text-muted-foreground">Method:</div>
                  <div className="font-medium capitalize">{formData.preferredContactMethod}</div>
                  <div className="text-muted-foreground">Preferred Time:</div>
                  <div className="font-medium">{formData.preferredContactTime || "Any time"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 flex-col sm:flex-row gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="flex items-center gap-1 order-2 sm:order-1 w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="flex items-center gap-1 order-1 sm:order-2 w-full sm:w-auto"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="min-w-28 order-1 sm:order-2 w-full sm:w-auto"
            >
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