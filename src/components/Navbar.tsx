"use client";

import Link from "next/link";
import { ShoppingBag, Globe, ShieldCheck, Sparkles } from "lucide-react";
import { useStore } from "./StoreProvider";

export function Navbar() {
  const { lang, toggleLang, itemCount, setIsCartOpen } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-cream/95 backdrop-blur-md border-b border-brand-border">
      {/* Announcement Bar */}
      <div className="bg-brand-ink text-brand-cream text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-pink shrink-0" />
        <span>
          {lang === "ar"
            ? "شحن لجميع محافظات مصر • الدفع عند الاستلام أو إنستاباي أو فودافون كاش"
            : "Shipping across all Egypt • Cash on Delivery, InstaPay & Vodafone Cash"}
        </span>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <img
            src="/images/logo.jpg"
            alt="HER ERA"
            className="h-14 w-14 rounded-2xl object-cover border border-brand-border shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-wider text-brand-rose leading-none">
              HER ERA
            </span>
            <span className="text-[10px] tracking-[0.2em] text-brand-muted uppercase mt-1">
              Wear Your Era
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-brand-ink">
          <Link href="/#catalog" className="hover:text-brand-rose transition-colors">
            {lang === "ar" ? "كل المنتجات" : "All Products"}
          </Link>
          <Link href="/#dresses" className="hover:text-brand-rose transition-colors">
            {lang === "ar" ? "فساتين" : "Dresses"}
          </Link>
          <Link href="/#sets" className="hover:text-brand-rose transition-colors">
            {lang === "ar" ? "أطقم كاجوال" : "Casual Sets"}
          </Link>
          <Link href="/#outerwear" className="hover:text-brand-rose transition-colors">
            {lang === "ar" ? "جواكت وكارديجان" : "Outerwear"}
          </Link>
          <Link href="/#knitwear" className="hover:text-brand-rose transition-colors">
            {lang === "ar" ? "تريكو" : "Knitwear"}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-brand-border text-xs font-semibold text-brand-ink hover:bg-brand-blush transition-colors"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-brand-rose" />
            <span>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-rose hover:bg-brand-blush transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "الإدارة" : "Admin"}</span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-rose text-white text-sm font-semibold shadow-sm hover:bg-brand-deep transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">
              {lang === "ar" ? "السلة" : "Bag"}
            </span>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold bg-white text-brand-rose rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
