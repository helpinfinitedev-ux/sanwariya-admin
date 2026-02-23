"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { fetchProducts } from "@/store/slices/productSlice";
import { ProductService } from "@/services/product/index.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "./_components/product-form";

export default function SweetsPage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(id);
    try {
      await ProductService.deleteProduct(id);
      toast.success("Product deleted successfully");
      dispatch(fetchProducts());
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const onSuccess = () => {
    setIsDialogOpen(false);
    dispatch(fetchProducts());
  };

  if (loading && products.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sweets</h1>
          <p className="text-muted-foreground text-sm">Manage your products here</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted">
                          {product.images?.[0] || product.image ? (
                            <Image src={product.images?.[0] || product.image} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs">No Img</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{product.description}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>{product.sold || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(product._id)} disabled={isDeleting === product._id}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <ProductForm initialData={selectedProduct} onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
