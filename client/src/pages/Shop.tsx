import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import SiteHeader from "@/components/SiteHeader";

const fallbackMenu = [
  { id: 1, name: "The Foodking Box", description: "Crispy chicken, loaded fries, dip and a cold drink.", category: "Combos", priceAed: "39.00", imageUrl: "https://foodking-react.vercel.app/assets/img/food/french-fry.png" },
  { id: 2, name: "Crispy Crown Burger", description: "Crunchy chicken, cheese, lettuce and house sauce.", category: "Burgers", priceAed: "29.00", imageUrl: "https://foodking-react.vercel.app/assets/img/food/burger.png" },
  { id: 3, name: "Dubai Heat Pizza", description: "Pepperoni, jalapeño, mozzarella and a hot honey finish.", category: "Pizza", priceAed: "49.00", imageUrl: "https://foodking-react.vercel.app/assets/img/food/pizza.png" },
];

type CartLine = { id: number; name: string; description: string; priceAed: number; imageUrl: string; quantity: number };
const money = (value: number) => `AED ${value.toFixed(2)}`;

export default function Shop() {
  const { data } = trpc.menu.list.useQuery();
  const createOrder = trpc.orders.create.useMutation();
  const menu = (data?.length ? data : fallbackMenu) as typeof fallbackMenu;
  const [cart, setCart] = useState<CartLine[]>(() => { try { return JSON.parse(localStorage.getItem("foodking-cart") || "[]") as CartLine[]; } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [form, setForm] = useState({ customerName: "", phone: "", email: "", address: "", notes: "" });
  const subtotal = useMemo(() => cart.reduce((total, line) => total + line.priceAed * line.quantity, 0), [cart]);
  const delivery = subtotal >= 100 || subtotal === 0 ? 0 : 8;
  const vat = subtotal * 0.05;
  const total = subtotal + delivery + vat;
  useEffect(() => { localStorage.setItem("foodking-cart", JSON.stringify(cart)); }, [cart]);

  const add = (item: typeof fallbackMenu[number]) => {
    setCart((lines) => lines.some((line) => line.id === item.id) ? lines.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line) : [...lines, { id: item.id, name: item.name, description: item.description, priceAed: Number(item.priceAed), imageUrl: item.imageUrl, quantity: 1 }]);
    setCartOpen(true);
  };
  const adjust = (id: number, delta: number) => setCart((lines) => lines.map((line) => line.id === id ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await createOrder.mutateAsync({ ...form, subtotalAed: subtotal, deliveryFeeAed: delivery, vatAed: vat, totalAed: total, items: cart.map((line) => ({ menuItemId: line.id, itemName: line.name, unitPriceAed: line.priceAed, quantity: line.quantity })) });
    setTrackingCode(result.trackingCode); setCart([]); setCheckoutOpen(false); setCartOpen(false);
  };

  return <div className="site-shell"><SiteHeader cartCount={cart.reduce((n, line) => n + line.quantity, 0)} onCartClick={() => setCartOpen(true)} /><main className="shop-main"><div className="shop-intro"><span className="eyebrow red">Foodking UAE menu</span><h1>Pick your<br /><em>favourites.</em></h1><p>Fresh, crisp, and delivered across the UAE. All prices are in AED.</p></div><div className="menu-filter"><span>All dishes</span><span>Combos</span><span>Burgers</span><span>Pizza</span><span>Kids</span></div><div className="menu-list">{menu.map((item) => <article className="menu-item" key={item.id}><div className="menu-item-image"><img src={item.imageUrl} alt={item.name} /></div><div className="menu-item-copy"><span className="menu-category">{item.category}</span><h2>{item.name}</h2><p>{item.description}</p><div className="menu-item-bottom"><strong>{money(Number(item.priceAed))}</strong><button className="order-button" onClick={() => add(item)}>Add to cart <Plus size={16} /></button></div></div></article>)}</div></main>{trackingCode && <div className="success-banner"><strong>Order received.</strong><span>Your tracking code is <b>{trackingCode}</b></span><a href={`/track?code=${trackingCode}`}>Track order <ArrowRight size={16} /></a></div>}{cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-dismiss" onClick={() => setCartOpen(false)}>×</button><span className="eyebrow red">Your order</span><h2>Ready when<br /><em>you are.</em></h2>{cart.length === 0 ? <p className="cart-empty">Your cart is empty. Add a favourite to get started.</p> : <>{cart.map((line) => <div className="cart-line" key={line.id}><img src={line.imageUrl} alt="" /><div><strong>{line.name}</strong><span>{money(line.priceAed)}</span><div className="quantity"><button onClick={() => adjust(line.id, -1)}><Minus size={13} /></button><b>{line.quantity}</b><button onClick={() => adjust(line.id, 1)}><Plus size={13} /></button><button className="remove" onClick={() => setCart((lines) => lines.filter((x) => x.id !== line.id))}><Trash2 size={13} /></button></div></div></div>)}<div className="cart-summary"><span>Subtotal <b>{money(subtotal)}</b></span><span>Delivery <b>{delivery ? money(delivery) : "FREE"}</b></span><span>VAT (5%) <b>{money(vat)}</b></span><strong>Total <b>{money(total)}</b></strong></div><button className="order-button checkout-button" onClick={() => setCheckoutOpen(true)}>Cash on delivery <ArrowRight size={16} /></button></>}</aside></div>}{checkoutOpen && <div className="checkout-overlay"><form className="checkout-card" onSubmit={submit}><button type="button" className="drawer-dismiss" onClick={() => setCheckoutOpen(false)}>×</button><span className="eyebrow red">Cash on delivery</span><h2>Where should<br /><em>we drop it?</em></h2><div className="checkout-grid"><label>Name<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} /></label><label>Mobile<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+971 50..." /></label><label className="full">Delivery address<textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Building, street, area, emirate" /></label><label className="full">Notes <span className="optional">optional</span><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label></div><div className="checkout-total"><span>Pay cash on delivery</span><strong>{money(total)}</strong></div><button className="order-button checkout-button" disabled={createOrder.isPending}>{createOrder.isPending ? "Sending order..." : "Place order"} <ArrowRight size={16} /></button>{createOrder.error && <p className="form-error">{createOrder.error.message}</p>}</form></div>}</div>;
}
