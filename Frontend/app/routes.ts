import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // index("routes/home.tsx"),
  layout("routes/wholesaler.tsx", [
    // route("wholesaler", "routes/wholesaler/index.tsx"),
    route("wholesaler/products", "routes/wholesaler/products.tsx"),
    // route("wholesaler/orders", "routes/wholesaler/orders.tsx"),
    // route("wholesaler/payments", "routes/wholesaler/payments.tsx"),
    // route("wholesaler/invoices", "routes/wholesaler/invoices.tsx"),
    // route("wholesaler/history", "routes/wholesaler/history.tsx"),
  ]),
] satisfies RouteConfig;
