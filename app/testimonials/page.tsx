"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { fetchTestimonials } from "@/store/slices/testimonialSlice";
import { TestimonialService } from "@/services/testimonial/index.service";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Star, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TestimonialForm } from "./_components/testimonial-form";

export default function TestimonialsPage() {
  const dispatch = useAppDispatch();
  const { testimonials, loading, error } = useAppSelector((state) => state.testimonials);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    setIsDeleting(id);
    try {
      await TestimonialService.deleteTestimonial(id);
      toast.success("Testimonial deleted successfully");
      dispatch(fetchTestimonials());
    } catch (err) {
      toast.error("Failed to delete testimonial");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTestimonial(null);
    setIsDialogOpen(true);
  };

  const onSuccess = () => {
    setIsDialogOpen(false);
    dispatch(fetchTestimonials());
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground text-sm">Customer reviews and ratings</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-muted-foreground">No testimonials found.</p>
          </div>
        ) : (
          testimonials.map((testimonial: any) => (
            <Card key={testimonial._id} className="relative group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg line-clamp-1">{testimonial.title || "Review"}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(testimonial)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(testimonial._id)} disabled={isDeleting === testimonial._id}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (testimonial.rating || 0) ? "fill-current" : "text-zinc-200"}`} />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-zinc-600 line-clamp-4 italic">"{testimonial.comment || testimonial.review}"</p>
              </CardContent>
              <CardFooter className="pt-0 flex flex-col items-start gap-2 border-t pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {testimonial.createdAt ? new Date(testimonial.createdAt).toLocaleDateString() : "N/A"}
                </div>
                {testimonial.url && (
                  <a href={testimonial.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                    <ExternalLink className="h-3 w-3" />
                    View Review
                  </a>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <TestimonialForm initialData={selectedTestimonial} onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
