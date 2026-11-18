"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, Truck, ShieldCheck, CreditCard } from "lucide-react";
import type { CategoryDTO, ProductDTO } from "@/lib/types";
import { useStore } from "./StoreProvider";
import { ProductCard } from "./ProductCard";

export function StorefrontClient({
  categories,
  products,
}: {
  categories: CategoryDTO[];
  products: ProductDTO[];
}) {
  const { lang } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.descriptionAr.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-blush via-brand-cream to-brand-cream border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-start">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-xs font-bold text-brand-rose shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === "ar" ? "كولكشن شتاء 2026 الجديد" : "New Winter 2026 Collection"}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-ink leading-tight">
              {lang === "ar" ? (
                <>
                  تألقي بإطلالتك مع{" "}
                  <span className="text-brand-rose font-display">HER ERA</span>
                </>
              ) : (
                <>
                  Wear Your{" "}
                  <span className="text-brand-rose font-display">Signature Era</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {lang === "ar"
                ? "اكتشفي تشكيلة مختارة من الفساتين الشتوية، الأطقم الكاجوال، الجواكت الجوخ، والتريكو الناعم بأعلى جودة وأناقة يومية."
                : "Discover curated winter dresses, cozy casual sets, wool-felt jackets, and soft knitwear crafted for effortless daily elegance."}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#catalog"
                className="px-7 py-3.5 rounded-full bg-brand-rose text-white font-bold text-sm shadow-md hover:bg-brand-deep transition-all"
              >
                {lang === "ar" ? "تسوقي الكولكشن الآن" : "Shop Collection"}
              </a>
              <a
                href="#categories"
                className="px-7 py-3.5 rounded-full bg-white border border-brand-border text-brand-ink font-bold text-sm hover:bg-brand-blush transition-all"
              >
                {lang === "ar" ? "تصفحي الأقسام" : "Browse Categories"}
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-brand-border/70 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                <Truck className="w-4 h-4 text-brand-rose shrink-0" />
                <span>{lang === "ar" ? "شحن لكل مصر" : "Egypt Delivery"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                <CreditCard className="w-4 h-4 text-brand-rose shrink-0" />
                <span>{lang === "ar" ? "إنستاباي وكاش" : "InstaPay & COD"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
                <ShieldCheck className="w-4 h-4 text-brand-rose shrink-0" />
                <span>{lang === "ar" ? "خامات مضمونة" : "Premium Quality"}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Collage (Updated with Cloudinary Links) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 max-w-xl mx-auto w-full">
            <div className="space-y-4 pt-6">
              <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-[3/4] group">
                <img
                  src="https://res.cloudinary.com/me1qwpbw/image/upload/v1795017690/photo_6043872078106137798_y.jpg"
                  alt="HER ERA Set 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-[3/4] group">
                <img
                  src="https://res.cloudinary.com/me1qwpbw/image/upload/v1795017697/photo_5927081837039652788_y.jpg"
                  alt="HER ERA Set 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-brand-ink">
            {lang === "ar" ? "تسوقي حسب الفئة" : "Shop by Category"}
          </h2>
          <span className="text-xs font-semibold text-brand-muted">
            {categories.length} {lang === "ar" ? "أقسام متاحة" : "Categories"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={cat.slug}
              onClick={() => {
                setSelectedCategory(cat.slug);
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`group text-start rounded-2xl overflow-hidden border transition-all bg-white ${
                selectedCategory === cat.slug
                  ? "border-brand-rose ring-2 ring-brand-pink/40 shadow-md"
                  : "border-brand-border hover:border-brand-pink shadow-xs"
              }`}
            >
              <div className="aspect-square overflow-hidden bg-brand-blush">
                <img
                  src={cat.image || "/images/logo.jpg"}
                  alt={lang === "ar" ? cat.nameAr : cat.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-sm font-bold text-brand-ink">
                  {lang === "ar" ? cat.nameAr : cat.nameEn}
                </h3>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  {cat._count?.products ?? 0}{" "}
                  {lang === "ar" ? "منتج" : "items"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Catalog */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl border border-brand-border p-4 sm:p-5 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-brand-muted absolute top-1/2 -translate-y-1/2 start-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "ابحثي عن دريس، سوت، جاكيت، بلوفر..."
                    : "Search dresses, sets, jackets, knitwear..."
                }
                className="w-full ps-11 pe-4 py-2.5 rounded-full bg-brand-blush/50 border border-brand-border text-sm focus:outline-none focus:border-brand-rose"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-rose shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2.5 rounded-full bg-brand-blush/50 border border-brand-border text-xs sm:text-sm font-semibold text-brand-ink focus:outline-none focus:border-brand-rose"
              >
                <option value="newest">
                  {lang === "ar" ? "الأحدث والمميز" : "Newest & Featured"}
                </option>
                <option value="price_asc">
                  {lang === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High"}
                </option>
                <option value="price_desc">
                  {lang === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low"}
                </option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-brand-rose text-white"
                  : "bg-brand-blush text-brand-ink hover:bg-brand-soft"
              }`}
            >
              {lang === "ar" ? `الكل (${products.length})` : `All (${products.length})`}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-brand-rose text-white"
                    : "bg-brand-blush text-brand-ink hover:bg-brand-soft"
                }`}
