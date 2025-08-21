"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCategories } from "@/hooks/use-categories"
import type { Category } from "@/lib/api"

interface CategoryGridProps {
  showTitle?: boolean
  maxItems?: number
  className?: string
}

function CategorySkeleton() {
  return (
    <Card className="group cursor-pointer overflow-hidden animate-pulse">
      <div className="relative overflow-hidden">
        <div className="w-full h-64 bg-muted" />
      </div>
      <CardContent className="p-6">
        <div className="h-6 bg-muted rounded mb-2" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </CardContent>
    </Card>
  )
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground mb-4">Failed to load categories: {error}</p>
      <Button onClick={onRetry} variant="outline" className="gap-2 bg-transparent">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  )
}

export function CategoryGrid({ showTitle = true, maxItems, className = "" }: CategoryGridProps) {
  const { categories, loading, error, refetch } = useCategories()

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />
  }

  const displayCategories = maxItems ? categories.slice(0, maxItems) : categories

  return (
    <section className={`py-24 bg-muted/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="font-serif-italic">Signature</span> Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each piece in our collection represents the perfect harmony of form, function, and timeless design.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <CategorySkeleton key={index} />)
            : displayCategories.map((category: Category, index: number) => (
                <Card
                  key={category.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in-up duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/products/category/${category.slug}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image || "/placeholder.svg?height=256&width=400&query=furniture category"}
                        alt={category.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/furniture-category.png"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                          {category.productCount} Items
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                        <ArrowRight className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground font-serif-italic">{category.description}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
        </div>

        {showTitle && !loading && categories.length > 0 && (
          <div className="text-center mt-12 animate-in fade-in duration-1000 delay-500">
            <Link href="/products">
              <Button size="lg" className="group hover:scale-105 transition-all duration-300 hover:shadow-lg">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
