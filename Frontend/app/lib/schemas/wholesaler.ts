import { z } from "zod";

// Product Schema
export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Product name is required").max(100, "Product name is too long"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  skuCode: z.string().min(1, "SKU Code is required"),
  stockQuantity: z.coerce.number().int().nonnegative("Stock cannot be negative"), // API uses stockQuantity
  unit: z.enum(["kg", "liter", "piece", "box", "packet", "carton", "dozen", "gms", "ml"]), // Added more units
  wholesalerId: z.coerce.number().positive("Wholesaler ID is required"),
  imageUrl: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;


// Order Schema
export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  total: z.coerce.number(),
});

export const orderSchema = z.object({
  id: z.string().optional(),
  retailerId: z.string().min(1, "Retailer is required"),
  retailerName: z.string().min(1, "Retailer name is required"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  totalAmount: z.coerce.number(),
  status: z.enum(["pending", "approved", "rejected", "completed"]),
  orderDate: z.string(),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;

// Payment Schema
export const paymentSchema = z.object({
  id: z.string().optional(),
  orderId: z.string().min(1, "Order ID is required"),
  retailerName: z.string().min(1, "Retailer name is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMode: z.enum(["cash", "upi", "bank_transfer", "cheque"]),
  transactionId: z.string().optional(),
  paymentDate: z.string(),
  status: z.enum(["pending", "completed", "failed"]),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// Order Modification Schema
export const modifyOrderSchema = z.object({
  orderId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantity: z.coerce.number().positive("Quantity must be greater than 0"),
      price: z.coerce.number(),
    })
  ),
  reason: z.string().min(5, "Please provide a reason for modification"),
});

export type ModifyOrderFormData = z.infer<typeof modifyOrderSchema>;

// Invoice Schema
export const invoiceSchema = z.object({
  invoiceNumber: z.string(),
  orderId: z.string(),
  wholesalerName: z.string(),
  wholesalerAddress: z.string(),
  wholesalerGST: z.string().optional(),
  retailerName: z.string(),
  retailerAddress: z.string(),
  retailerGST: z.string().optional(),
  items: z.array(orderItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  totalAmount: z.number(),
  invoiceDate: z.string(),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
