"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import type { Product } from "@/lib/types"

interface AddProductDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface ProductSpecs {
  Display: string
  Chip: string
  Camera: string
  Storage: string
  Battery: string
}

export function AddProductDialog({ isOpen, onClose }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "",
    brand: "",
    image: "",
    images: ["", "", ""],
    inStock: true,
    rating: 0,
    reviewCount: 0,
    specs: {
      Display: "",
      Chip: "",
      Camera: "",
      Storage: "",
      Battery: "",
    },
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      
      // Add basic product information
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('originalPrice', formData.originalPrice.toString())
      formDataToSend.append('category', formData.category)
      formDataToSend.append('brand', formData.brand)
      formDataToSend.append('inStock', formData.inStock.toString())
      formDataToSend.append('rating', formData.rating.toString())
      formDataToSend.append('reviewCount', formData.reviewCount.toString())
      formDataToSend.append('featured', formData.featured.toString())

      // Add specifications as a JSON string
      formDataToSend.append('specs', JSON.stringify(formData.specs))

      // Get the main image file
      const mainImageInput = document.getElementById('mainImage') as HTMLInputElement
      const mainImageFile = mainImageInput?.files?.[0]
      if (mainImageFile) {
        formDataToSend.append('image', mainImageFile)
      }

      // Get additional image files
      const additionalImageInputs = [0, 1, 2].map(index =>
        document.getElementById(`additionalImage${index}`) as HTMLInputElement
      )
      
      additionalImageInputs.forEach(input => {
        const file = input?.files?.[0]
        if (file) {
          formDataToSend.append('additionalImages', file)
        }
      })

      // Validate required fields
      if (!mainImageFile) {
        throw new Error('Main product image is required')
      }

      if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.brand) {
        throw new Error('Please fill in all required fields')
      }

      console.log('Submitting form data:', {
        ...formData,
        image: mainImageFile ? mainImageFile.name : null
      });

      // Log the FormData contents before sending
      const formDataEntries = Array.from(formDataToSend.entries()).map(([key, value]) => {
        if (value instanceof File) {
          return [key, { name: value.name, type: value.type, size: value.size }];
        }
        return [key, value];
      });
      console.log('FormData being sent:', Object.fromEntries(formDataEntries));

      const response = await fetch('http://localhost:3001/api/products/add', {
        method: 'POST',
        body: formDataToSend,
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          const textData = await response.text();
          console.error('Unexpected response type:', contentType);
          console.error('Response text:', textData);
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error parsing response:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        throw new Error(`Server response error: ${errorMessage}`);
      }

      if (!response.ok) {
        console.error('Server error response:', responseData);
        throw new Error(
          responseData.details || 
          responseData.message || 
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      console.log('Product added successfully:', responseData)
      onClose()
    } catch (error) {
      // Type guard to ensure we handle both Error objects and unknown errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while adding the product';

      console.error('Error details:', {
        message: errorMessage,
        error: error
      });

      // Show a more user-friendly error message
      const userMessage = errorMessage.includes('Server response error') || errorMessage.includes('Server error')
        ? 'Failed to communicate with the server. Please try again.'
        : errorMessage;

      alert(userMessage);

      // If the error is related to validation, don't close the dialog
      if (!errorMessage.includes('required') && !errorMessage.includes('fill in')) {
        onClose();
      }
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSpecChange = (spec: keyof ProductSpecs, value: string) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [spec]: value }
    }))
  }

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store the file object in the state
      const newImages = [...formData.images]
      newImages[index] = URL.createObjectURL(file)
      handleChange('images', newImages)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., iPhone 15 Pro Max" 
                required 
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input 
                id="brand" 
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g., Apple" 
                required 
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter detailed product description" 
              className="min-h-[80px] w-full" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (FRW)</Label>
              <Input 
                id="price" 
                type="number" 
                value={formData.price || ''}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                min="0" 
                step="0.01" 
                required 
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (FRW)</Label>
              <Input 
                id="originalPrice" 
                type="number" 
                value={formData.originalPrice || ''}
                onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value))}
                min="0" 
                step="0.01"
                className="w-full" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartphones">Smartphones</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Product Images</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainImage">Main Image</Label>
                <Input 
                  id="mainImage" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleChange('image', e.target.files?.[0]?.name || '')}
                  required 
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`additionalImage${index}`}>Additional Image {index + 1}</Label>
                    <Input 
                      id={`additionalImage${index}`} 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => handleChange('inStock', checked)}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleChange('featured', checked)}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}