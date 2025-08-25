"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, ArrowLeft, Grid, List, RefreshCw, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCategories } from "@/hooks/use-categories"
import { useProductsByCategory } from "@/hooks/use-products"

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "rating">("name")

  const { categories, loading: categoriesLoading } = useCategories()
  const {
    products,
    loading: productsLoading,
    error: productsError,
    retry: retryProducts,
  } = useProductsByCategory(categorySlug)

  const category = categories.find((cat) => cat.slug === categorySlug)

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return a.name.localeCompare(b.name)
    }
  })

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Loading Category...</h1>
          <p className="text-muted-foreground">Please wait while we fetch the category details.</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested category could not be found.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
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
              <span className="text-primary font-medium">{category.name}</span>
              <Link
                href="/#about"
                className="text-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/#contact"
                className="text-foreground hover:text-muted-foreground transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            <Button variant="outline" size="sm" className="hidden md:block bg-transparent">
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
            <span className="text-foreground font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Hero */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in slide-in-from-left duration-1000">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Link>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  <span className="font-serif-italic">{category.name}</span> Collection
                </h1>
                <p className="text-xl text-muted-foreground mb-6">{category.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-base px-4 py-2">
                    {category.productCount} Products
                  </Badge>
                  {category.subcategories && (
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {category.subcategories.length} Subcategories
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="relative animate-in slide-in-from-right duration-1000 delay-300">
              <div className="relative group cursor-pointer">
                <img
                  src={category.image || "/placeholder.svg?height=400&width=600&query=furniture category"}
                  alt={category.name}
                  className="w-full h-[400px] object-cover rounded-lg shadow-xl group-hover:scale-[1.02] transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/furniture-category.png"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories */}
      {category.subcategories && (
        <section className="py-12 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Browse by Type</h2>
            <div className="flex flex-wrap gap-3">
              {category.subcategories.map((subcategory, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  {subcategory}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {category.name} <span className="font-serif-italic">Products</span>
              </h2>
              <p className="text-muted-foreground">{sortedProducts.length} products available</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {productsError && (
            <div className="text-center py-8 mb-8 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">Failed to load products: {productsError}</p>
              <Button onClick={retryProducts} variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}

          <div className={`grid gap-8 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {sortedProducts.map((product, index) => (
              <Card
                key={product.id}
                className={`group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in-up duration-700 ${
                  viewMode === "list" ? "flex" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={`/products/${product.slug}`} className={viewMode === "list" ? "flex w-full" : ""}>
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                        viewMode === "list" ? "w-full h-48" : "w-full h-64"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {product.isNew && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">New</Badge>
                      </div>
                    )}

                    {product.originalPrice && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive">Sale</Badge>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {/* <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">({product.reviewCount})</span> */}
                      </div>
                      {product.subcategory && (
                        <Badge variant="outline" className="text-xs">
                          {product.subcategory}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">Rs{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            Rs{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {sortedProducts.length === 0 && !productsError && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find any products in this category.</p>
              <Link href="/products">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Explore Other <span className="font-serif-italic">Collections</span>
            </h2>
            <p className="text-muted-foreground">Discover more premium furniture categories</p>
          </div>

          {categoriesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories
                .filter((c) => c.id !== categorySlug)
                .slice(0, 3)
                .map((relatedCategory, index) => (
                  <Card
                    key={relatedCategory.id}
                    className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in-up duration-700"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link href={`/products/category/${relatedCategory.slug}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            relatedCategory.image || "/placeholder.svg?height=192&width=400&query=furniture category"
                          }
                          alt={relatedCategory.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/furniture-category.png"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold mb-1">{relatedCategory.name}</h3>
                          <p className="text-sm opacity-90">{relatedCategory.productCount} Products</p>
                        </div>
                        <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </section>

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
