import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const stages = ["received", "preparing", "ready", "picked_up", "on_the_way", "delivered", "cancelled"] as const;
const labels: Record<string, string> = { received: "Received", preparing: "Preparing", ready: "Ready", picked_up: "Picked up", on_the_way: "On the way", delivered: "Delivered", cancelled: "Cancelled" };

export default function StaffOrders() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: orders = [], isLoading } = trpc.orders.listForStaff.useQuery(undefined, { enabled: Boolean(user?.role === "admin") });
  const update = trpc.orders.updateStatus.useMutation({ onSuccess: () => utils.orders.listForStaff.invalidate() });
  if (loading) return <div className="staff-page"><SiteHeader /><main className="simple-page"><p>Checking staff access…</p></main></div>;
  if (!user) return <div className="staff-page"><SiteHeader /><main className="simple-page"><span className="eyebrow">Staff access</span><h1>Kitchen<br /><em>control.</em></h1><p>Sign in with an authorized Foodking UAE staff account to manage order status updates.</p><button className="order-button" onClick={() => startLogin()}>Sign in <ArrowRight size={16} /></button></main></div>;
  if (user.role !== "admin") return <div className="staff-page"><SiteHeader /><main className="simple-page"><span className="eyebrow">Staff access</span><h1>Not<br /><em>authorized.</em></h1><p>Your account does not have staff permissions.</p></main></div>;
  return <div className="staff-page"><SiteHeader /><main className="staff-main"><span className="eyebrow red">Live order desk</span><h1>Keep the<br /><em>feast moving.</em></h1>{isLoading ? <p>Loading orders…</p> : orders.length === 0 ? <p className="track-hint">No orders yet. New cash-on-delivery orders will appear here.</p> : <div className="staff-orders">{orders.map((order) => <article className="staff-order" key={order.id}><div><span className="menu-category">{order.trackingCode}</span><h2>{order.customerName}</h2><p>{order.phone} · {order.address}</p></div><div className="staff-order-controls"><strong>AED {Number(order.totalAed).toFixed(2)}</strong><select value={order.status} onChange={(event) => update.mutate({ orderId: order.id, status: event.target.value as typeof stages[number] })}>{stages.map((stage) => <option value={stage} key={stage}>{labels[stage]}</option>)}</select></div></article>)}</div>}</main></div>;
}
