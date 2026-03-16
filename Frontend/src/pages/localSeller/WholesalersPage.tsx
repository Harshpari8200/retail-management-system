import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type SubscriptionStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED" | "INACTIVE";

export function WholesalersPage() {


  const [wholesalers, setWholesalers] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<Record<number, SubscriptionStatus>>({});
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const sellerId = user?.id;

  useEffect(() => {
    loadWholesalers();
    loadSubscribedWholesalers();
  }, []);

  async function loadWholesalers() {
    try {
      const data = await api.getWholesalers();
      setWholesalers(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubscribedWholesalers() {
  if (!sellerId) return;

  try {
    const subscribed = await api.getSubscribedWholesalers(sellerId); // returns array
    const statusMap: Record<number, SubscriptionStatus> = {};

    subscribed.forEach((w: any) => {
      statusMap[w.id] = w.status as SubscriptionStatus;
    });

    setStatuses(statusMap);
  } catch (err: any) {
    console.error("Failed to load subscriptions:", err.message);
  }
}

  // Subscribe
  async function handleSubscribe(id: number) {
    if (!sellerId) return;
    setStatuses((prev) => ({ ...prev, [id]: "PENDING" }));
    try {
      await api.subscribeWholesaler(sellerId, id);
    } catch (err: any) {
      console.error(err.message);
      setStatuses((prev) => ({ ...prev, [id]: "NONE" }));
    }
  }

  // Cancel subscription request
  async function handleCancel(id: number) {
    if (!sellerId) return;
    setStatuses((prev) => ({ ...prev, [id]: "NONE" }));
    try {
      await api.unsubscribeWholesaler(sellerId, id);
    } catch (err: any) {
      console.error(err.message);
      setStatuses((prev) => ({ ...prev, [id]: "PENDING" }));
    }
  }

  // Unsubscribe approved
  async function handleUnsubscribe(id: number) {
    if (!sellerId) return;
    setStatuses((prev) => ({ ...prev, [id]: "INACTIVE" }));
    try {
      await api.unsubscribeWholesaler(sellerId, id);
    } catch (err: any) {
      console.error(err.message);
      setStatuses((prev) => ({ ...prev, [id]: "APPROVED" }));
    }
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Available Wholesalers
        </h1>
        <p className="text-sm text-slate-500">
          Browse and subscribe to wholesalers.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Business Name</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {wholesalers.map((w) => (
              <tr
                key={w.id}
                className="border-b last:border-none hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-slate-900">
                  {w.Username}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {w.businessName}
                </td>

                <td className="px-4 py-3 flex justify-end items-center gap-2">

                  {/* View Products always visible */}
                  <Link
                    to={`/local-seller/wholesalers/${w.id}`}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    View Products
                  </Link>

                  {/* NOT SUBSCRIBED */}
                  {(!statuses[w.id] || statuses[w.id] === "NONE") && (
                    <button
                      onClick={() => handleSubscribe(w.id)}
                      className="ml-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                    >
                      Subscribe
                    </button>
                  )}

                  {/* PENDING */}
                  {statuses[w.id] === "PENDING" && (
                    <>
                      <button
                        disabled
                        className="ml-2 bg-amber-400 text-white px-3 py-1.5 rounded-md text-sm cursor-not-allowed opacity-80"
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => handleCancel(w.id)}
                        className="ml-2 bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* APPROVED */}
                  {statuses[w.id] === "APPROVED" && (
                    <>
                      <button
                        disabled
                        className="ml-2 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm cursor-not-allowed opacity-80"
                      >
                        Subscribed
                      </button>

                      <button
                        onClick={() => handleUnsubscribe(w.id)}
                        className="ml-2 bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
                      >
                        Unsubscribe
                      </button>
                    </>
                  )}

                  {/* REJECTED / INACTIVE */}
                  {(statuses[w.id] === "REJECTED" || statuses[w.id] === "INACTIVE") && (
                    <button
                      onClick={() => handleSubscribe(w.id)}
                      className="ml-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                    >
                      Subscribe Again
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div >
  );
}