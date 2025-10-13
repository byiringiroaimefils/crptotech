"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaved?: (product: Product) => void;
}

interface ProductSpecs {
  Display: string;
  Camera: string;
  Storage: string;
  Battery: string;
}

export function AddProductDialog({ isOpen, onClose, product, onSaved }: AddProductDialogProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "",
    brand: "",
    image: "",
    images: ["", "", ""],
    specs: { Display: "", Camera: "", Storage: "", Battery: "" },
    featured: false,
    quantity: 1,
  });

  const mainImageRef = useRef<HTMLInputElement | null>(null);
  const additionalImageRefs = useRef<HTMLInputElement[]>([]);
  const { toast } = useToast();

  // Prefill form when editing
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
        specs: {
          Display: product.specs?.Display || "",
          Camera: product.specs?.Camera || "",
          Storage: product.specs?.Storage || "",
          Battery: product.specs?.Battery || "",
        },
        featured: product.featured || false,
      });
    }
  }, [product, isOpen]);

  // Handle preview of newly selected images
  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>, main = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (main) {
      setFormData((prev) => ({ ...prev, image: url }));
    } else {
      const newImages = [...formData.images];
      newImages[index] = url;
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (spec: keyof ProductSpecs, value: string) => {
    setFormData((prev) => ({ ...prev, specs: { ...prev.specs, [spec]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("quantity", formData.quantity.toString());
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("originalPrice", formData.originalPrice.toString());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("featured", formData.featured.toString());
      formDataToSend.append("specs", JSON.stringify(formData.specs));

      // Main image file
      const mainImageFile = mainImageRef.current?.files?.[0];
      if (mainImageFile) {
        formDataToSend.append("image", mainImageFile);
      } else if (formData.image) {
        formDataToSend.append("existingImage", formData.image);
      }

      // Additional images files
      additionalImageRefs.current.forEach((input, index) => {
        const file = input?.files?.[0];
        if (file) {
          formDataToSend.append("additionalImages", file);
        } else if (formData.images[index]) {
          formDataToSend.append("existingAdditionalImages", formData.images[index]);
        }
      });

      // ✅ Single correct fetch logic
      const url = product
        ? `${apiUrl}/products/${product._id || product.id}`
        : `${apiUrl}/products/add`;
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, { method, body: formDataToSend });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Server error");

      const savedProduct: Product = {
        ...data.product,
        id: data.product._id,
        image: data.product.imageUrl || data.product.image,
        images: data.product.images || [],
        price: Number(data.product.price),
        quantity: Number(data.product.quantity),
        originalPrice: data.product.originalPrice ? Number(data.product.originalPrice) : undefined,
      };

      onSaved?.(savedProduct);
      toast({
        title: product ? "Product updated" : "Product created",
        description: product
          ? "Product updated successfully."
          : "Product created successfully.",
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({ title: "Failed to save product", description: message });
    }
  };

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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
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
                onClick={() =>
                  handleChange("quantity", Math.max(formData.quantity - 1, 1))
                }
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  handleChange("quantity", parseInt(e.target.value) || 1)
                }
                className="w-16 text-center"
                min={1}
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

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  handleChange("price", parseFloat(e.target.value))
                }
                min={0}
                step={0.01}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  handleChange("originalPrice", parseFloat(e.target.value))
                }
                min={0}
                step={0.01}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => handleChange("category", v)}
              >
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

          {/* Specs */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(formData.specs).map((spec) => (
                <div key={spec} className="space-y-2">
                  <Label htmlFor={spec}>{spec}</Label>
                  <Input
                    value={formData.specs[spec as keyof ProductSpecs]}
                    onChange={(e) =>
                      handleSpecChange(spec as keyof ProductSpecs, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Product Images</h3>

            {/* Main Image */}
            <div className="space-y-2">
              <Label>Main Image</Label>
              <Input
                type="file"
                accept="image/*"
                ref={mainImageRef}
                onChange={(e) => handleImageChange(0, e, true)}
              />
              {formData.image && (
                <div className="relative w-32 h-32 mt-2 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={formData.image}
                    alt="Main Image"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((img, index) => (
                <div key={index} className="space-y-2">
                  <Label>Additional Image {index + 1}</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      if (el) additionalImageRefs.current[index] = el;
                    }}
                    onChange={(e) => handleImageChange(index, e)}
                  />
                  {img && (
                    <div className="relative w-28 h-28 mt-2 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={img}
                        alt={`Additional ${index + 1}`}
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
              checked={formData.featured}
              onCheckedChange={(checked) => handleChange("featured", checked)}
            />
            <Label>Featured Product</Label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
