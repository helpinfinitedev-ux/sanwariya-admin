"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TestimonialService } from "@/services/testimonial/index.service";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  images: z.array(z.string()).optional(),
});

interface TestimonialFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function TestimonialForm({ initialData, onSuccess }: TestimonialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating || 5,
      comment: initialData?.comment || "",
      images: initialData?.images || [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        await TestimonialService.updateTestimonial(initialData._id, values);
        toast.success("Testimonial updated successfully");
      } else {
        await TestimonialService.createTestimonial(values);
        toast.success("Testimonial created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => field.onChange(star)} className="focus:outline-none">
                      <Star className={`h-6 w-6 ${star <= field.value ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"}`} />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea placeholder="Share your thoughts..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Testimonial" : "Create Testimonial"}
        </Button>
      </form>
    </Form>
  );
}
