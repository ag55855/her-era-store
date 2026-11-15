"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "./StoreProvider";

export function CartDrawer() {
  const {
    lang,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useStore();

  if (!isCartOpen) return null;

  const ArrowIcon = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-ink/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Panel */}
      <aside className="relative z-10 w-full max-w-md bg-brand-cream h-full shadow-2xl flex flex-col border-s border-brand-border">
        <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-blush/50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-brand-rose" />
            <h2 className="text-lg font-bold text-brand-ink">
              {lang === "ar" ? "حقيبة التسوق" : "Shopping Bag"}
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-brand-soft text-brand-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand-blush flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-brand-pink" />
              </div>
              <p className="text-base font-semibold text-brand-ink mb-1">
                {lang === "ar" ? "حقيبة التسوق فارغة حالياً" : "Your bag is empty"}
              </p>
              <p className="text-sm text-brand-muted mb-6">
                {lang === "ar"
                  ? "اكتشفي أحدث تشكيلة من فساتين وأطقم HER ERA"
                  : "Explore the latest HER ERA winter collection"}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-brand-rose text-white text-sm font-semibold hover:bg-brand-deep transition-colors"
              >
                {lang === "ar" ? "تصفحي المنتجات" : "Start Shopping"}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 p-3 rounded-2xl bg-white border border-brand-border shadow-xs"
              >
                <img
                  src={item.image}
                  alt={lang === "ar" ? item.nameAr : item.nameEn}
                  className="w-20 h-26 object-cover rounded-xl shrink-0 bg-brand-blush"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-brand-ink line-clamp-2">
                      {lang === "ar" ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1">
                      {lang === "ar" ? "المقاس:" : "Size:"} {item.size} •{" "}
                      {lang === "ar" ? "اللون:" : "Color:"} {item.color}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-brand-rose">
                      {(item.price * item.quantity).toLocaleString()}{" "}
                      {lang === "ar" ? "ج.م" : "EGP"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center border border-brand-border rounded-full bg-brand-blush/40">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="p-1.5 hover:text-brand-rose"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="p-1.5 hover:text-brand-rose"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.size, item.color)
                        }
                        className="p-1.5 text-brand-muted hover:text-red-500 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-brand-border bg-white space-y-4">
            <div className="flex items-center justify-between text-base font-bold text-brand-ink">
              <span>{lang === "ar" ? "الإجمالي الفرعي" : "Subtotal"}</span>
              <span className="text-brand-rose text-lg">
                {subtotal.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              {lang === "ar"
                ? "يتم حساب مصاريف الشحن عند اختيار المحافظة في صفحة إتمام الطلب."
                : "Shipping is calculated at checkout based on your governorate."}
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3.5 px-6 rounded-full bg-brand-rose text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-deep transition-colors shadow-md"
            >
              <span>{lang === "ar" ? "إتمام الطلب الآن" : "Proceed to Checkout"}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
