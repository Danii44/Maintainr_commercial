import { useState } from "react";
import { ArrowRight, Check, Clock3, Search, Truck } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";

const stages = ["received", "preparing", "ready", "picked_up", "on_the_way", "delivered"] as const;
const labels: Record<string, string> = { received: "Order received", preparing: "In the kitchen", ready: "Ready to go", picked_up: "Picked up", on_the_way: "On the way", delivered: "Delivered", cancelled: "Cancelled" };

export default function Track() {
  const [location] = useLocation();
  const initial = new URLSearchParams(location.split("?")[1] ?? "").get("code") ?? "";
  const [code, setCode] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const { data, isLoading, error } = trpc.orders.track.useQuery({ trackingCode: submitted }, { enabled: submitted.length > 0, refetchInterval: 10000 });
  const currentIndex = data ? stages.indexOf(data.order.status as typeof stages[number]) : -1;

  return <div className="track-page"><SiteHeader /><main className="track-main"><span className="eyebrow red">Foodking UAE delivery</span><h1>Follow the<br /><em>feast.</em></h1><p className="track-lede">Enter your tracking code and we’ll show you where your order is in the journey.</p><form className="tracking-search" onSubmit={(event) => { event.preventDefault(); setSubmitted(code.trim().toUpperCase()); }}><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="FK-XXXXXX" aria-label="Tracking code" /><button aria-label="Track order"><Search size={19} /></button></form>{isLoading && <p className="track-state">Checking your order...</p>}{error && <p className="track-state error">We couldn’t find that code. Check it and try again.</p>}{data && <section className="tracking-card"><div className="tracking-top"><div><span className="menu-category">Tracking code</span><h2>{data.order.trackingCode}</h2></div><div className="live-pill"><span /> Updates every 10 sec</div></div><div className="tracking-progress">{stages.map((stage, index) => <div className={`tracking-stage ${index <= currentIndex ? "done" : ""} ${index === currentIndex ? "current" : ""}`} key={stage}><div className="stage-icon">{index < currentIndex ? <Check size={16} /> : index === currentIndex ? <Truck size={16} /> : <Clock3 size={15} />}</div><span>{labels[stage]}</span></div>)}</div><div className="tracking-detail"><div><span>Delivery to</span><strong>{data.order.address}</strong></div><div><span>Amount to collect</span><strong>AED {Number(data.order.totalAed).toFixed(2)}</strong></div><div><span>Payment</span><strong>Cash on delivery</strong></div></div><div className="tracking-events"><h3>Latest updates</h3>{data.events.map((event) => <div className="event-row" key={event.id}><span className="event-dot" /><div><strong>{labels[event.status]}</strong><small>{event.note || "Foodking UAE team updated your order."}</small></div><time>{new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div>)}</div></section>}{!data && !isLoading && !error && <div className="track-hint"><Truck size={20} /><span>After placing a cash-on-delivery order, your tracking code appears on the confirmation screen.</span><a href="/shop">Browse the menu <ArrowRight size={16} /></a></div>}</main></div>;
}
