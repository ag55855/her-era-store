"use client";

import Link from "next/link";
import { useStore } from "./StoreProvider";

export function Footer() {
  const { lang } = useStore();

  return (
    <footer className="bg-brand-ink text-brand-cream mt-20 border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/logo.jpg"
              alt="HER ERA"
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-display font-bold text-xl text-brand-pink">
                HER ERA
              </h3>
              <p className="text-[11px] tracking-[0.2em] text-brand-soft/80 uppercase">
                Wear Your Era
              </p>
            </div>
          </div>
          <p className="text-sm text-brand-cream/75 leading-relaxed">
            {lang === "ar"
              ? "براند أزياء حريمي عصري يجمع بين الأناقة والراحة بأعلى جودة وخامات مختارة بعناية لكل إطلالاتك."
              : "Modern women's fashion boutique blending elegance, modest silhouettes, and everyday comfort."}
          </p>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 text-brand-pink">
            {lang === "ar" ? "روابط سريعة" : "Quick Links"}
          </h4>
          <ul className="space-y-2.5 text-sm text-brand-cream/80">
            <li>
              <Link href="/#catalog" className="hover:text-brand-pink transition-colors">
                {lang === "ar" ? "جميع المنتجات" : "All Products"}
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-brand-pink transition-colors">
                {lang === "ar" ? "إتمام الطلب" : "Checkout"}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brand-pink transition-colors">
                {lang === "ar" ? "لوحة تحكم المتجر" : "Store Admin"}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-base mb-4 text-brand-pink">
            {lang === "ar" ? "طرق الدفع المتاحة" : "Payment Methods"}
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold">
              {lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold">
              InstaPay
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold">
              Vodafone Cash
            </span>
          </div>
          <p className="text-xs text-brand-cream/60 mt-4">
            {lang === "ar"
              ? "التوصيل متاح لجميع محافظات مصر خلال 2-4 أيام عمل."
              : "Delivery across all Egyptian governorates within 2–4 business days."}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-cream/60">
        © {new Date().getFullYear()} HER ERA — Wear Your Era. All rights reserved.
      </div>
    </footer>
  );
}
