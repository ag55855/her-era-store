"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Check, Ruler, Truck, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";

export function ProductDetailClient({
  product,
  related,
}: {
  product: ProductDTO;
  related: ProductDTO[];
}) {
  const { lang, addToCart } = useStore();
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const images = Array.isArray(product.images) ? product.images : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : ["One Size"];

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(
    colors[0]?.image || images[0] || "/images/logo.jpg"
  );
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "One Size");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const activeColor = colors[selectedColorIdx];
  const BackIcon = lang === "ar" ? ArrowRight : ArrowLeft;

  const handleColorSelect = (idx: number) => {
    setSelectedColorIdx(idx);
    if (colors[idx]?.image) {
      setSelectedImage(colors[idx].image!);
    }
  };

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      size: selectedSize,
      color: activeColor
        ? lang === "ar"
          ? activeColor.nameAr
          : activeColor.nameEn
        : lang === "ar"
        ? "الأساسي"
        : "Default",
      image: selectedImage,
      quantity,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-rose mb-6 transition-colors"
      >
        <BackIcon className="w-4 h-4" />
        <span>{lang === "ar" ? "العودة للمتجر" : "Back to Store"}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] max-h-[680px] w-full rounded-3xl overflow-hidden bg-brand-blush border border-brand-border shadow-md">
            <img
              src={selectedImage}
              alt={lang === "ar" ? product.nameAr : product.nameEn}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? "border-brand-rose ring-2 ring-brand-pink/40"
                      : "border-brand-border opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <span className="px-3 py-1 rounded-full bg-brand-blush text-brand-rose text-xs font-bold">
                  {lang === "ar" ? product.category.nameAr : product.category.nameEn}
                </span>
              )}
              {product.collectionName && (
                <span className="px-3 py-1 rounded-full bg-brand-cream border border-brand-border text-brand-muted text-xs font-semibold">
                  {product.collectionName}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink leading-snug">
              {lang === "ar" ? product.nameAr : product.nameEn}
            </h1>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-extrabold text-brand-rose">
                {product.price.toLocaleString()}{" "}
                <span className="text-base font-bold">
                  {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-brand-muted line-through">
                  {product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
            {lang === "ar" ? product.descriptionAr : product.descriptionEn}
          </p>

          {/* Colors */}
          {colors.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-sm font-bold text-brand-ink">
                {lang === "ar" ? "اللون:" : "Color:"}{" "}
                <span className="text-brand-rose">
                  {activeColor
                    ? lang === "ar"
                      ? activeColor.nameAr
                      : activeColor.nameEn
                    : ""}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c, idx) => (
                  <button
                    key={c.nameEn + idx}
                    onClick={() => handleColorSelect(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition-all ${
                      selectedColorIdx === idx
                        ? "border-brand-rose bg-brand-blush text-brand-rose"
                        : "border-brand-border bg-white text-brand-ink hover:border-brand-pink"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/15"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{lang === "ar" ? c.nameAr : c.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-brand-ink">
                {lang === "ar" ? "المقاس:" : "Size:"}{" "}
                <span className="text-brand-rose">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-rose hover:underline"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "دليل المقاسات" : "Size Guide"}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedSize === size
                      ? "bg-brand-ink text-white border-brand-ink"
                      : "bg-white text-brand-ink border-brand-border hover:border-brand-rose"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {showSizeGuide && (
              <div className="p-4 rounded-2xl bg-brand-blush/70 border border-brand-border text-xs space-y-1.5">
                <p className="font-bold text-brand-ink">
                  {lang === "ar" ? "جدول المقاسات التقريبي (كجم):" : "Approximate Size Guide (kg):"}
                </p>
                <p>S: 50 – 60 kg | M: 60 – 70 kg | L: 70 – 82 kg | XL: 82 – 95 kg</p>
                <p>One Size: {lang === "ar" ? "يناسب من 55 إلى 85 كجم" : "Fits 55 – 85 kg"}</p>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-brand-border rounded-full bg-white px-2 py-1.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full hover:bg-brand-blush font-bold"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full hover:bg-brand-blush font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 py-4 px-6 rounded-full bg-brand-rose text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-deep transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{lang === "ar" ? "أضيفي إلى الحقيبة" : "Add to Bag"}</span>
            </button>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl border border-brand-border p-4 space-y-2.5 text-xs text-brand-muted">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === "ar"
                  ? "متاح الدفع عند الاستلام أو عبر إنستاباي وفودافون كاش"
                  : "Cash on Delivery, InstaPay & Vodafone Cash accepted"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-rose shrink-0" />
              <span>
                {lang === "ar"
                  ? "شحن سريع لجميع محافظات مصر خلال 2-4 أيام عمل"
                  : "Fast delivery across Egypt within 2–4 business days"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-rose shrink-0" />
              <span>
                {lang === "ar"
                  ? "إمكانية المعاينة قبل الاستلام لضمان الخامة والمقاس"
                  : "Inspect upon delivery to guarantee quality and fit"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 pt-12 border-t border-brand-border">
          <h2 className="text-2xl font-extrabold text-brand-ink mb-6">
            {lang === "ar" ? "قد يعجبك أيضاً" : "You May Also Like"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
