import { z } from "zod";
import { ORDER_STATUS } from "@/types";

const orderStatusSchema = z.enum(ORDER_STATUS);

export const orderInsertSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  customer_name: z.string().min(1, "Customer name is required").max(255),
  delivery_address: z.string().min(1, "Delivery address is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price_per_item: z.number().nonnegative("Price must be 0 or greater"),
  status: orderStatusSchema.optional(),
});
export type OrderInsert = z.infer<typeof orderInsertSchema>;

export const orderUpdateSchema = z
  .object({
    product_name: z.string().min(1).max(Number.MAX_SAFE_INTEGER).optional(),
    customer_name: z.string().min(1).max(255).optional(),
    delivery_address: z.string().min(1).optional(),
    quantity: z.number().int().positive().optional(),
    price_per_item: z.number().nonnegative().optional(),
    status: orderStatusSchema.optional(),
  })
  .strict();
export type OrderUpdate = z.infer<typeof orderUpdateSchema>;
