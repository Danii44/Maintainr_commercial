import { useState } from "react";
import { Clock3, MapPin, Menu, Search, ShoppingBag, Truck, X } from "lucide-react";

const mark = "/manus-storage/foodking-uae-mark_24e2a1eb.png";

export default function SiteHeader({ cartCount = 0, onCartClick }: { cartCount?: number; onCartClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const nav = [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Journal", href: "/news" }, { label: "Contact", href: "/contact" }];
  return <>
    <div className="utility-bar"><div className="utility-inner"><span><Truck size={14} /> Secure delivery across the UAE</span><span className="utility-hide"><Clock3 size={14} /> Daily, 11AM – 2AM</span><span className="utility-hide"><MapPin size={14} /> Dubai · Abu Dhabi · Sharjah</span><a href="tel:+97145000000">+971 4 500 0000</a></div></div>
    <header className="nav-wrap"><div className="nav-inner"><a className="brand" href="/"><img src={mark} alt="Foodking mark" /><span>FOOD<span>KING</span></span></a><nav className="desktop-nav">{nav.map((item) => <a className={currentPath === item.href ? "active" : ""} href={item.href} key={item.href}>{item.label}</a>)}</nav><div className="nav-actions"><button aria-label="Search" onClick={() => window.location.assign("/shop")}><Search size={20} /></button><button className="cart-button" onClick={onCartClick ?? (() => window.location.assign("/shop"))} aria-label="Open cart"><ShoppingBag size={20} /><b>{cartCount}</b></button><a className="nav-cta" href="/shop">Order now <span>→</span></a><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button></div></div></header>
    {menuOpen && <div className="mobile-drawer"><button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button><img src={mark} alt="Foodking mark" /><span className="drawer-brand">FOODKING</span>{nav.map((item) => <a href={item.href} onClick={() => setMenuOpen(false)} key={item.href}>{item.label}</a>)}<a className="order-button" href="/shop">Order now <span>→</span></a></div>}
  </>;
}
