"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  ArrowLeft,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Ruler,
  Palette,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useProduct } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { QuoteForm } from "@/components/quote-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ProductPage() {
  const params = useParams()
  const productSlug = params.slug as string
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)

  const { product, loading: productLoading, error: productError, retry: retryProduct } = useProduct(productSlug)
  const { categories } = useCategories()

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Loading Product...</h1>
          <p className="text-muted-foreground">Please wait while we fetch the product details.</p>
        </div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{productError ? "Failed to Load Product" : "Product Not Found"}</h1>
          {productError && <p className="text-muted-foreground mb-6">Error: {productError}</p>}
          <div className="flex gap-4 justify-center">
            {productError && (
              <Button onClick={retryProduct} variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const category = categories.find((cat) => cat.slug === product.category)
  // For related products, we'll use a simple filter for now - this could be enhanced with API call
  const relatedProducts = [] // Will be empty for now since we need API integration

  const handleGetQuote = () => {
    const quoteItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      selectedColor: product.colors[selectedColor],
    }
    setShowQuoteDialog(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      console.log("[v0] Product URL copied to clipboard")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform duration-200"
            >
              <span className="font-serif-italic">Matlix</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-muted-foreground transition-colors duration-200">
                Home
              </Link>
              <Link
                href="/products"
                className="text-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                href={`/products/category/${product.category}`}
                className="text-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                {category?.name}
              </Link>
              <span className="text-primary font-medium">{product.name}</span>
            </div>

            <Button variant="outline" size="sm" className="hidden md:block bg-transparent" onClick={handleGetQuote}>
              Get Quote
            </Button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={`/products/category/${product.category}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {category?.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/products/category/${product.category}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {category?.name}
          </Link>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Product Images */}
            <div className="space-y-4 animate-in slide-in-from-left duration-1000">
              <div className="relative group">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-[600px] object-cover rounded-lg shadow-xl group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {product.isNew && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">New Arrival</Badge>
                  </div>
                )}

                {product.originalPrice && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="destructive">
                      Save Rs {(product.originalPrice - product.price).toLocaleString()}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8 animate-in slide-in-from-right duration-1000 delay-300">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {category?.name}
                  </Badge>
                  {product.subcategory && (
                    <Badge variant="secondary" className="text-sm">
                      {product.subcategory}
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {/* <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div> */}
                    {/* <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviewCount} reviews)</span> */}
                  </div>
                  <Badge variant={product.inStock ? "default" : "secondary"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold">Rs{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-2xl text-muted-foreground line-through">
                      Rs{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Color: {product.colors[selectedColor]}
                  </h3>
                  <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(index)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                          selectedColor === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-lg font-semibold">Quantity:</label>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-border">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1 group hover:scale-105 transition-all duration-200"
                    onClick={handleGetQuote}
                    disabled={!product.inStock}
                  >
                    Get Quote
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`hover:scale-105 transition-all duration-200 ${
                      isWishlisted ? "bg-primary/10 border-primary" : ""
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="hover:scale-105 transition-all duration-200 bg-transparent"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Truck className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-sm text-muted-foreground">On orders over $1000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">Warranty</p>
                    <p className="text-sm text-muted-foreground">Lifetime support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <RotateCcw className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-muted-foreground">Easy returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Product Details</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">Key Features:</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dimensions" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Ruler className="h-6 w-6" />
                    Dimensions
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="font-medium">Width:</span>
                        <span>
                          {product.dimensions.width} {product.dimensions.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="font-medium">Height:</span>
                        <span>
                          {product.dimensions.height} {product.dimensions.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="font-medium">Depth:</span>
                        <span>
                          {product.dimensions.depth} {product.dimensions.unit}
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h4 className="font-semibold mb-3">Size Guide</h4>
                      <p className="text-sm text-muted-foreground">
                        Please ensure you have adequate space for delivery and placement. Our team can provide space
                        planning consultation if needed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Materials & Craftsmanship</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Premium Materials:</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {product.materials.map((material, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="font-medium">{material}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h4 className="font-semibold mb-3">Care Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Clean with a soft, dry cloth. Avoid harsh chemicals and direct sunlight. Professional cleaning
                        recommended for deep maintenance.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{product.rating} out of 5</span>
                      <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Sample Reviews */}
                    {[
                      {
                        name: "Sarah Johnson",
                        rating: 5,
                        date: "2 weeks ago",
                        review:
                          "Absolutely stunning piece! The quality is exceptional and it looks even better in person. The delivery was smooth and the team was very professional.",
                      },
                      {
                        name: "Michael Chen",
                        rating: 4,
                        date: "1 month ago",
                        review:
                          "Great quality furniture. Very happy with the purchase. The only minor issue was the delivery took a bit longer than expected, but worth the wait.",
                      },
                      {
                        name: "Emma Davis",
                        rating: 5,
                        date: "2 months ago",
                        review:
                          "Perfect addition to our living room. The craftsmanship is outstanding and the customer service was excellent throughout the process.",
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">{review.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      {/* Related products section will be empty for now */}
      {/* {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                You Might Also <span className="font-serif-italic">Like</span>
              </h2>
              <p className="text-muted-foreground">More from our {category?.name} collection</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <Card
                  key={relatedProduct.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in-up duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.images[0] || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">${relatedProduct.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span className="text-sm">{relatedProduct.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Quote for {product.name}</DialogTitle>
          </DialogHeader>
          <QuoteForm
            initialItems={[
              {
                productId: product.id,
                productName: product.name,
                quantity,
                selectedColor: product.colors[selectedColor],
              },
            ]}
            onSuccess={(quoteId) => {
              console.log("[v0] Quote submitted successfully:", quoteId)
              // Keep dialog open to show success message
            }}
            onClose={() => setShowQuoteDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link
                href="/"
                className="text-xl font-bold hover:scale-105 transition-transform duration-200 inline-block"
              >
                <span className="font-serif-italic">Matlix</span>
              </Link>
              <p className="text-background/80">
                Crafting sophisticated living spaces with premium furniture and timeless design.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Collections</h4>
              <ul className="space-y-2 text-background/80">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products/category/${cat.slug}`}
                      className="hover:text-background transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-background/80">
                <li>
                  <Link href="/products" className="hover:text-background transition-colors duration-200">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="hover:text-background transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-background transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <ul className="space-y-2 text-background/80">
                <li>+1 (555) 123-4567</li>
                <li>hello@luxeinteriors.com</li>
                <li>123 Design District</li>
                <li>New York, NY 10001</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/60">
            <p>&copy; 2024 Matlix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
