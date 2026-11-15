"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { useStore } from "./StoreProvider";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { lang, addToCart } = useStore();
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const images = Array.isArray(product.images) ? product.images : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : ["One Size"];

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const activeColor = colors[selectedColorIdx];
  const displayImage = activeColor?.image || images[0] || "/images/logo.jpg";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      size: sizes[0] || "One Size",
      color: activeColor
        ? lang === "ar"
          ? activeColor.nameAr
          : activeColor.nameEn
        : lang === "ar"
        ? "الأساسي"
        : "Default",
      image: displayImage,
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-brand-border/80 shadow-xs hover:shadow-xl hover:border-brand-pink/50 transition-all duration-300"
    >
      {/* Portrait Image 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-blush">
        <img
          src={displayImage}
          alt={lang === "ar" ? product.nameAr : product.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {product.badgeAr && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-ink/85 backdrop-blur-xs text-white text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-brand-pink" />
              {product.badgeAr}
            </span>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-rose text-white text-[11px] font-bold w-fit">
              -
              {Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100
              )}
              %
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 end-3 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xs text-brand-ink text-xs font-bold shadow-md hover:bg-brand-rose hover:text-white transition-all opacity-95 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{lang === "ar" ? "إضافة سريعة" : "Quick Add"}</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          <p className="text-[11px] font-semibold text-brand-rose mb-1">
            {product.category
              ? lang === "ar"
                ? product.category.nameAr
                : product.category.nameEn
              : ""}
          </p>
          <h3 className="text-sm sm:text-base font-bold text-brand-ink line-clamp-2 group-hover:text-brand-rose transition-colors">
            {lang === "ar" ? product.nameAr : product.nameEn}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-extrabold text-brand-ink">
              {product.price.toLocaleString()}{" "}
              <span className="text-xs font-semibold text-brand-muted">
                {lang === "ar" ? "ج.م" : "EGP"}
              </span>
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-brand-muted line-through">
                {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {colors.slice(0, 4).map((c, idx) => (
                <button
                  key={c.nameEn + idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColorIdx(idx);
                  }}
                  title={lang === "ar" ? c.nameAr : c.nameEn}
                  className={`w-4 h-4 rounded-full border transition-transform ${
                    selectedColorIdx === idx
                      ? "ring-2 ring-brand-rose ring-offset-1 scale-110"
                      : "border-black/20 hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
