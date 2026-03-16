import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type Product } from '../../../services/api';

export function WholesalerViews() {
  const { id } = useParams();
  const wholesalerId = Number(id);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [userApproved, setUserApproved] = useState(false);

//   async function checkUserApproval() {
//   try {
//     const res = await api.getSubscriptionStatus(userId, wholesalerId);
//     setUserApproved(res.status === "APPROVED");
//   } catch {
//     setUserApproved(false);
//   }
// }
  
  useEffect(() => {
    if (!wholesalerId) return;

    loadProducts();

  }, [wholesalerId]);
  
  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const page = await api.getWholesalerProducts(wholesalerId);
      setProducts(page ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }
  function addToCart(product: Product) {
    setCart((prev) => [...prev, product]);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Wholesaler Products
        </h1>
        <p className="text-sm text-slate-500">
          Browse available products from this wholesaler.
        </p>
      </header>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Wholesaler Products
        </h1>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Cart ({cart.length})
        </button>
      </div>

      {/* Table */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {product.name}
              </h3>

              <p className="text-sm text-slate-500">
                {product.category}
              </p>

              <p className="text-slate-700 mt-2">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              <p className="text-xs text-slate-500">
                Stock: {product.stockQuantity}
              </p>

              <button
                onClick={() => userApproved && addToCart(product)}
                disabled={!userApproved}
                className={`mt-3 w-full py-2 rounded-lg ${userApproved
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Add to Cart
              </button>

              {!userApproved && (
                <p className="text-xs text-red-500 mt-1">
                  Add to cart available after approval
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}