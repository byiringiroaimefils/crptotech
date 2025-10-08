"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/types"
import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"


interface AddProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  onSaved?: (product: Product) => void
}

interface ProductSpecs {
  Display: string
  Camera: string
  Storage: string
  Battery: string
}

export function AddProductDialog({ isOpen, onClose, product, onSaved }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "",
    brand: "",
    image: "",
    images: ["", "", ""],
    rating: 0,
    reviewCount: 0,
    specs: {
      Display: "",
      Camera: "",
      Storage: "",
      Battery: "",
    },
    featured: false,
    quantity: 1,
  })

  const mainImageRef = useRef<HTMLInputElement | null>(null)
  const additionalImageRefs = useRef<HTMLInputElement[]>([])
  const { toast } = useToast()

  // Prefill when editing
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        quantity: product.quantity || 1,
        price: product.price || 0,
        originalPrice: product.originalPrice || 0,
        category: product.category || "",
        brand: product.brand || "",
        image: product.image || "",
        images: Array.isArray(product.images) ? product.images : ["", "", ""],
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        specs: {
          Display: product.specs?.Display || "",
          Camera: product.specs?.Camera || "",
          Storage: product.specs?.Storage || "",
          Battery: product.specs?.Battery || "",
        },
        featured: product.featured || false,
      })
    }
  }, [product, isOpen])

  // Clean up object URLs
  useEffect(() => {
    return () => {
      formData.images.forEach((img) => {
        if (img.startsWith("blob:")) URL.revokeObjectURL(img)
      })
    }
  }, [formData.images])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSpecChange = (spec: keyof ProductSpecs, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [spec]: value },
    }))
  }

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newImages = [...formData.images]
      newImages[index] = URL.createObjectURL(file)
      handleChange("images", newImages)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formDataToSend = new FormData()

      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("quantity", formData.quantity.toString())
      formDataToSend.append("price", formData.price.toString())
      formDataToSend.append("originalPrice", formData.originalPrice.toString())
      formDataToSend.append("category", formData.category)
      formDataToSend.append("brand", formData.brand)
      formDataToSend.append("rating", formData.rating.toString())
      formDataToSend.append("reviewCount", formData.reviewCount.toString())
      formDataToSend.append("featured", formData.featured.toString())
      formDataToSend.append("specs", JSON.stringify(formData.specs))

      const mainImageFile = mainImageRef.current?.files?.[0]
      if (mainImageFile) formDataToSend.append("image", mainImageFile)

      additionalImageRefs.current.forEach((input) => {
        const file = input?.files?.[0]
        if (file) formDataToSend.append("additionalImages", file)
      })

      if (!product && !mainImageFile) throw new Error("Main product image is required")
      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.brand) {
        throw new Error("Please fill in all required fields")
      }

      let response: Response
      let responseData: any

      if (product) {
        const payload = {
          ...formData,
          specs: formData.specs,
          images: formData.images.filter(Boolean),
        }

        response = await fetch(`http://localhost:3001/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch("http://localhost:3001/api/products/add", {
          method: "POST",
          body: formDataToSend,
        })
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        const textData = await response.text()
        console.error("Unexpected response:", textData)
        throw new Error("Invalid response format from server")
      }

      if (!response.ok) {
        throw new Error(responseData.message || `Server error: ${response.status}`)
      }

      const createdOrUpdated = responseData.product
      const mapped: Product = {
        ...createdOrUpdated,
        id: createdOrUpdated._id,
        image: createdOrUpdated.imageUrl,
        price: Number(createdOrUpdated.price),
        quantity: Number(createdOrUpdated.quantity),
        originalPrice: createdOrUpdated.originalPrice ? Number(createdOrUpdated.originalPrice) : undefined,
        rating: createdOrUpdated.rating ? Number(createdOrUpdated.rating) : 0,
        reviewCount: createdOrUpdated.reviewCount ? Number(createdOrUpdated.reviewCount) : 0,
      }

      onSaved?.(mapped)
      toast({
        title: product ? "Product updated" : "Product created",
        description: product ? "Product updated successfully." : "Product created successfully.",
      })
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred."
      toast({ title: "Failed to save product", description: message })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>{product ? "Update Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., iPhone 15 Pro Max"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                placeholder="e.g., Apple"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleChange("quantity", Math.max(formData.quantity - 1, 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 1)}
                className="w-16 text-center"
                min="1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleChange("quantity", formData.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Price, Original Price, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (FRW)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (FRW)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) => handleChange("originalPrice", parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartphones">Smartphones</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(formData.specs).map((spec) => (
                <div key={spec} className="space-y-2">
                  <Label htmlFor={spec}>{spec}</Label>
                  <Input
                    id={spec}
                    value={formData.specs[spec as keyof ProductSpecs]}
                    onChange={(e) => handleSpecChange(spec as keyof ProductSpecs, e.target.value)}
                    placeholder={`Enter ${spec.toLowerCase()}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Product Images</h3>
            <div className="space-y-2">
              <Label htmlFor="mainImage">Main Image</Label>
              <Input
                id="mainImage"
                type="file"
                accept="image/*"
                ref={mainImageRef}
                onChange={(e) => handleChange("image", e.target.files?.[0]?.name || "")}
                required={!product}
              />
              {product?.image && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    Current image (kept if not replaced):
                  </p>
                  <div className="relative w-32 h-32 overflow-hidden rounded-md bg-muted">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`additionalImage${index}`}>Additional Image {index + 1}</Label>
                  <Input
                    id={`additionalImage${index}`}
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      if (el) additionalImageRefs.current[index] = el
                    }}
                    onChange={(e) => handleImageChange(index, e)}
                  />
                  {product?.images?.[index] && (
                    <div className="relative w-28 h-28 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={product.images[index]}
                        alt={`${product.name} additional ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

           {/* Featured */}
           <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleChange("featured", checked)}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
