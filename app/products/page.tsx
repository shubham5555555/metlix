"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Grid, List, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useCategories } from "@/hooks/use-categories"
import { useProducts } from "@/hooks/use-products"

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { products, loading: productsLoading, error: productsError } = useProducts()

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const featuredProducts = products.slice(0, 6)

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  if (categoriesError || productsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load products</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
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
              <span className="font-serif-italic">Metlix</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-muted-foreground transition-colors duration-200">
                Home
              </Link>
              <span className="text-primary font-medium">Products</span>
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

      {/* Hero Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-in fade-in duration-1000">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="font-serif-italic">Premium</span> Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our complete range of luxury furniture and accessories, crafted for sophisticated living.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-in fade-in duration-1000">
            <h2 className="text-3xl font-bold mb-4">
              <span className="font-serif-italic">Featured</span> Products
            </h2>
            <p className="text-muted-foreground">Handpicked selections from our premium collection</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredProducts.map((product, index) => (
              <Card
                key={product.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in-up duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=256&width=400&text=${encodeURIComponent(product.name)}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {product.isNew && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground animate-pulse">New</Badge>
                      </div>
                    )}

                    {product.originalPrice && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="animate-bounce">
                          Sale
                        </Badge>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium ml-1">{product.rating || 4.5}</span>
                        <span className="text-sm text-muted-foreground ml-1">({product.reviewCount || 0})</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">Rs{product.price?.toLocaleString() || 0}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            Rs{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {categories.find((c) => c.id === product.category)?.name || product.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-in fade-in duration-1000">
            <h2 className="text-3xl font-bold mb-4">
              Shop by <span className="font-serif-italic">Category</span>
            </h2>
            <p className="text-muted-foreground">Explore our carefully curated collections</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card
                key={category.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in-up duration-700 glass-morphism"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/products/category/${category.slug}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=192&width=400&text=${encodeURIComponent(category.name)}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1 font-serif-italic">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.productCount || 0} Products</p>
                    </div>
                    <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                All <span className="font-serif-italic">Products</span>
              </h2>
              <p className="text-muted-foreground">{filteredProducts.length} products available</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="transition-all duration-200"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="transition-all duration-200"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus-premium"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className={`
            ${viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : ""}
            ${viewMode === "list" ? "grid grid-cols-1 gap-8" : ""}
          `}
          >
            {filteredProducts.map((product, index) => (
              <Card
                key={product.id}
                className={`
                  group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in-up duration-700 
                  ${viewMode === "list" ? "flex" : ""}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={`/products/${product.slug}`} className={viewMode === "list" ? "flex w-full" : ""}>
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                        viewMode === "list" ? "w-full h-48" : "w-full h-64"
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=256&width=400&text=${encodeURIComponent(product.name)}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {product.isNew && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground animate-pulse">New</Badge>
                      </div>
                    )}

                    {product.originalPrice && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="animate-bounce">
                          Sale
                        </Badge>
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium ml-1">{product.rating || 4.5}</span>
                        <span className="text-sm text-muted-foreground ml-1">({product.reviewCount || 0})</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">Rs{product.price?.toLocaleString() || 0}</span>
                        {product.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            Rs{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {categories.find((c) => c.id === product.category)?.name || product.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
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
                <span className="font-serif-italic">Metlix</span>
              </Link>
              <p className="text-background/80">
                Crafting sophisticated living spaces with premium furniture and timeless design.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Collections</h4>
              <ul className="space-y-2 text-background/80">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products/category/${category.slug}`}
                      className="hover:text-background transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {category.name}
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
            <p>&copy; 2024 Metlix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
