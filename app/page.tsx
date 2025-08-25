"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Phone, Mail, MapPin, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { CategoryGrid } from "@/components/category-grid"
import { useCategories } from "@/hooks/use-categories"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { categories } = useCategories()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform duration-200"
              >
                <span className="font-serif-italic">Matlix</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-foreground hover:text-muted-foreground transition-all duration-200 hover:scale-105 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
              <Link
                href="/products"
                className="text-foreground hover:text-muted-foreground transition-all duration-200 hover:scale-105 relative group"
              >
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground hover:text-muted-foreground transition-all duration-200 hover:scale-105 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-muted-foreground transition-all duration-200 hover:scale-105 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hidden md:block hover:scale-105 transition-all duration-200 hover:shadow-lg bg-transparent"
              onClick={() => scrollToSection("contact")}
            >
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="py-4 space-y-2">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all duration-200"
              >
                Home
              </button>
              <Link
                href="/products"
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all duration-200"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-all duration-200"
              >
                Contact
              </button>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 bg-transparent"
                onClick={() => scrollToSection("contact")}
              >
                Get Quote
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-24 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left duration-1000">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="w-fit hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  <span className="font-serif-italic">Premium Collection</span>
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Crafted for
                  <span className="block font-serif-italic bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Sophisticated Living
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Discover our curated collection of premium furniture and interior design solutions, meticulously
                  crafted to transform your space into a sanctuary of elegance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="group hover:scale-105 transition-all duration-200 hover:shadow-lg"
                  onClick={() => scrollToSection("collections")}
                >
                  Explore Collections
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-all duration-200 hover:shadow-lg bg-transparent"
                  onClick={() => scrollToSection("contact")}
                >
                  Schedule Consultation
                </Button>
              </div>
            </div>
            <div className="relative animate-in slide-in-from-right duration-1000 delay-300">
              <div className="relative group cursor-pointer">
                <img
                  src="https://asset-ng.skoiy.com/9b80a6f781ff336f/btggfehukgsu.jpg?w=970&q=90&fm=webp"
                  alt="Luxury living room showcase"
                  className="w-full h-[600px] object-cover rounded-lg shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-lg shadow-lg border hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 fill-primary text-primary animate-pulse" />
                  <span className="font-semibold">4.9/5</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-serif-italic">Trusted by 500+</span> clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section - Now using API-powered CategoryGrid */}
      <section id="collections" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="font-serif-italic">Signature</span> Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each piece in our collection represents the perfect harmony of form, function, and timeless design.
            </p>
          </div> */}
          <CategoryGrid />
          {/* <div className="text-center mt-12 animate-in fade-in duration-1000 delay-500">
            <Link href="/products">
              <Button size="lg" className="group hover:scale-105 transition-all duration-300 hover:shadow-lg">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </div> */}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-in slide-in-from-left duration-1000">
              <h2 className="text-3xl lg:text-4xl font-bold">
                <span className="font-serif-italic">Craftsmanship</span> Meets Innovation
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For over two decades, we have been at the forefront of premium furniture design, combining traditional
                craftsmanship with contemporary aesthetics to create pieces that stand the test of time.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Premium Materials",
                    description: "Only the finest woods, metals, and fabrics make it into our collection.",
                  },
                  {
                    title: "Expert Craftsmanship",
                    description: "Each piece is meticulously crafted by skilled artisans with decades of experience.",
                  },
                  {
                    title: "Custom Solutions",
                    description: "Bespoke designs tailored to your unique space and lifestyle requirements.",
                  },
                  {
                    title: "Lifetime Support",
                    description: "Comprehensive warranty and maintenance services for lasting satisfaction.",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer group animate-in fade-in-up duration-700"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <h4 className="font-semibold group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-in slide-in-from-right duration-1000 delay-300">
              <div className="relative group cursor-pointer">
                <img
                  src="https://img.freepik.com/free-photo/carpenter-cutting-mdf-board-inside-workshop_23-2149451066.jpg"
                  alt="Craftsman at work"
                  className="w-full h-[500px] object-cover rounded-lg shadow-xl group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-in fade-in duration-1000">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="font-serif-italic">Let's Create</span> Something Beautiful
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to transform your space? Get in touch with our design experts for a personalized consultation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Call Us",
                description: "Speak with our design consultants",
                contact: "+1 (555) 123-4567",
                action: () => window.open("tel:+15551234567"),
              },
              {
                icon: Mail,
                title: "Email Us",
                description: "Get detailed information and quotes",
                contact: "hello@luxeinteriors.com",
                action: () => window.open("mailto:hello@luxeinteriors.com"),
              },
              {
                icon: MapPin,
                title: "Visit Showroom",
                description: "Experience our collections in person",
                contact: "123 Design District, NY 10001",
                action: () => window.open("https://maps.google.com/?q=123+Design+District+NY+10001"),
              },
            ].map((contact, index) => (
              <Card
                key={index}
                className="text-center p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 group animate-in fade-in-up duration-700"
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={contact.action}
              >
                <contact.icon className="h-8 w-8 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                  {contact.title}
                </h3>
                <p className="text-muted-foreground mb-4">{contact.description}</p>
                <p className="font-semibold">{contact.contact}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-in fade-in duration-1000 delay-500">
            <Button
              size="lg"
              className="group hover:scale-105 transition-all duration-300 hover:shadow-lg"
              onClick={() => {
                console.log("[v0] Consultation booking clicked")
                // Could open booking modal or redirect to booking page
              }}
            >
              Schedule Your Consultation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
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
                <span className="font-serif-italic">Matlix</span>
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
              <h4 className="font-semibold">Services</h4>
              <ul className="space-y-2 text-background/80">
                {["Interior Design", "Custom Furniture", "Space Planning", "Consultation"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection("contact")}
                      className="hover:text-background transition-colors duration-200"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <ul className="space-y-2 text-background/80">
                <li>
                  <button
                    onClick={() => window.open("tel:+15551234567")}
                    className="hover:text-background transition-colors duration-200"
                  >
                    +1 (555) 123-4567
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.open("mailto:hello@luxeinteriors.com")}
                    className="hover:text-background transition-colors duration-200"
                  >
                    hello@luxeinteriors.com
                  </button>
                </li>
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
