"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Truck,
  Smartphone,
  Wallet,
  Banknote,
  ShoppingBag,
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { EGYPT_GOVERNORATES, type StoreSettingsDTO } from "@/lib/types";

export default function CheckoutPage() {
  const { lang, cart, subtotal, clearCart } = useStore();
  const [settings, setSettings] = useState<StoreSettingsDTO | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [governorate, setGovernorate] = useState("القاهرة");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "INSTAPAY" | "VODAFONE_CASH"
  >("COD");
  const [paymentReference, setPaymentReference] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    total: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(() => {});
  }, []);

  const isCairoOrGiza = governorate === "القاهرة" || governorate === "الجيزة";
  const shippingCost = isCairoOrGiza
    ? settings?.shippingCairo ?? 60
    : settings?.shippingOther ?? 85;
  const total = subtotal + (cart.length > 0 ? shippingCost : 0);

  const handleCopy = (val: string) => {
    navigator.clipboard?.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (cart.length === 0) return;

    if (
      (paymentMethod === "INSTAPAY" || paymentMethod === "VODAFONE_CASH") &&
      !paymentReference.trim()
    ) {
      setError(
        lang === "ar"
          ? "يرجى إدخال رقم التحويل أو اسم الحساب المحول منه لتأكيد الدفع"
          : "Please enter your transfer reference or sender phone/handle"
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          governorate,
          address,
          notes,
          paymentMethod,
          paymentReference,
          items: cart,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء إرسال الطلب");
        setSubmitting(false);
        return;
      }
      clearCart();
      setConfirmedOrder({
        orderNumber: data.order.orderNumber,
        total: data.order.total,
      });
    } catch {
      setError("تعذر الاتصال بالخادم، حاولي مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-brand-border p-8 sm:p-10 shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
            {lang === "ar" ? "تم استلام طلبك بنجاح!" : "Order Confirmed!"}
          </h1>
          <p className="text-sm text-brand-muted">
            {lang === "ar"
              ? "شكراً لتسوقك من HER ERA. سيتواصل معك فريقنا لتأكيد الشحن خلال ساعات."
              : "Thank you for shopping with HER ERA. Our team will contact you shortly."}
          </p>
          <div className="bg-brand-blush rounded-2xl p-4 space-y-1">
            <p className="text-xs text-brand-muted">
              {lang === "ar" ? "رقم الطلب" : "Order Number"}
            </p>
            <p className="text-xl font-extrabold text-brand-rose">
              {confirmedOrder.orderNumber}
            </p>
            <p className="text-sm font-bold text-brand-ink pt-1">
              {lang === "ar" ? "الإجمالي:" : "Total:"}{" "}
              {confirmedOrder.total.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 rounded-full bg-brand-rose text-white font-bold text-sm hover:bg-brand-deep transition-colors"
          >
            {lang === "ar" ? "العودة للتسوق" : "Continue Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-brand-border p-10 space-y-4">
          <ShoppingBag className="w-12 h-12 text-brand-pink mx-auto" />
          <h1 className="text-xl font-bold text-brand-ink">
            {lang === "ar" ? "السلة فارغة حالياً" : "Your bag is empty"}
          </h1>
          <Link
            href="/"
            className="inline-block px-7 py-3 rounded-full bg-brand-rose text-white font-bold text-sm"
          >
            {lang === "ar" ? "تصفحي المنتجات" : "Browse Products"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink mb-8">
        {lang === "ar" ? "إتمام الطلب" : "Checkout"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-brand-ink flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-rose" />
              <span>{lang === "ar" ? "بيانات التوصيل" : "Delivery Details"}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1.5">
                  {lang === "ar" ? "الاسم بالكامل *" : "Full Name *"}
                </label>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream text-sm focus:outline-none focus:border-brand-rose"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1.5">
                  {lang === "ar" ? "رقم الموبايل (واتساب) *" : "Phone Number *"}
                </label>
                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream text-sm focus:outline-none focus:border-brand-rose"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1.5">
                {lang === "ar" ? "المحافظة *" : "Governorate *"}
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream text-sm focus:outline-none focus:border-brand-rose"
              >
                {EGYPT_GOVERNORATES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1.5">
                {lang === "ar" ? "العنوان بالتفصيل *" : "Full Address *"}
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "الشارع، رقم العمارة، الشقة، علامة مميزة..."
                    : "Street, building, apartment, landmark..."
                }
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream text-sm focus:outline-none focus:border-brand-rose"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1.5">
                {lang === "ar" ? "ملاحظات إضافية (اختياري)" : "Order Notes (Optional)"}
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-cream text-sm focus:outline-none focus:border-brand-rose"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-brand-ink">
              {lang === "ar" ? "طريقة الدفع" : "Payment Method"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-2xl border text-start transition-all ${
                  paymentMethod === "COD"
                    ? "border-brand-rose bg-brand-blush ring-2 ring-brand-pink/40"
                    : "border-brand-border hover:border-brand-pink"
                }`}
              >
                <Banknote className="w-5 h-5 text-brand-rose mb-2" />
                <p className="text-sm font-bold text-brand-ink">
                  {lang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
                </p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  {lang === "ar" ? "كاش للمندوب" : "Pay upon arrival"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("INSTAPAY")}
                className={`p-4 rounded-2xl border text-start transition-all ${
                  paymentMethod === "INSTAPAY"
                    ? "border-brand-rose bg-brand-blush ring-2 ring-brand-pink/40"
                    : "border-brand-border hover:border-brand-pink"
                }`}
              >
                <Smartphone className="w-5 h-5 text-brand-rose mb-2" />
                <p className="text-sm font-bold text-brand-ink">InstaPay</p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  {lang === "ar" ? "تحويل إنستاباي" : "Instant transfer"}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("VODAFONE_CASH")}
                className={`p-4 rounded-2xl border text-start transition-all ${
                  paymentMethod === "VODAFONE_CASH"
                    ? "border-brand-rose bg-brand-blush ring-2 ring-brand-pink/40"
                    : "border-brand-border hover:border-brand-pink"
                }`}
              >
                <Wallet className="w-5 h-5 text-brand-rose mb-2" />
                <p className="text-sm font-bold text-brand-ink">
                  {lang === "ar" ? "فودافون كاش" : "Vodafone Cash"}
                </p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  {lang === "ar" ? "تحويل محفظة" : "Mobile wallet"}
                </p>
              </button>
            </div>

            {paymentMethod === "INSTAPAY" && (
              <div className="p-4 rounded-2xl bg-brand-blush/70 border border-brand-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-brand-muted">
                      {lang === "ar" ? "حساب إنستاباي للتحويل:" : "InstaPay Handle:"}
                    </p>
                    <p className="text-base font-extrabold text-brand-rose" dir="ltr">
                      {settings?.instapayHandle || "herera@instapay"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(settings?.instapayHandle || "herera@instapay")
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-brand-border text-xs font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "تم النسخ" : "نسخ"}</span>
                  </button>
                </div>
                <input
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "اكتبي رقم المرجع أو حساب إنستاباي المحول منه *"
                      : "Enter your InstaPay sender handle or reference *"
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:border-brand-rose"
                />
              </div>
            )}

            {paymentMethod === "VODAFONE_CASH" && (
              <div className="p-4 rounded-2xl bg-brand-blush/70 border border-brand-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-brand-muted">
                      {lang === "ar" ? "رقم فودافون كاش للتحويل:" : "Vodafone Cash Number:"}
                    </p>
                    <p className="text-base font-extrabold text-brand-rose" dir="ltr">
                      {settings?.vodafoneCashNumber || "01000000000"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(settings?.vodafoneCashNumber || "01000000000")
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-brand-border text-xs font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "تم النسخ" : "نسخ"}</span>
                  </button>
                </div>
                <input
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder={
                    lang === "ar"
                      ? "اكتبي الرقم المحول منه أو رقم العملية *"
                      : "Enter sender phone number or transaction ID *"
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm focus:outline-none focus:border-brand-rose"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-brand-border p-6 space-y-5 shadow-xs sticky top-28">
            <h2 className="text-lg font-bold text-brand-ink">
              {lang === "ar" ? "ملخص الطلب" : "Order Summary"}
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pe-1">
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-14 h-18 rounded-xl object-cover bg-brand-blush shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-brand-ink line-clamp-1">
                      {lang === "ar" ? item.nameAr : item.nameEn}
                    </p>
                    <p className="text-[11px] text-brand-muted">
                      {item.size} • {item.color} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand-ink shrink-0">
                    {(item.price * item.quantity).toLocaleString()}{" "}
                    {lang === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                <span>
                  {subtotal.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>
                  {lang === "ar" ? `الشحن (${governorate})` : `Shipping (${governorate})`}
                </span>
                <span>
                  {shippingCost.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-brand-ink pt-2 border-t border-brand-border">
                <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="text-brand-rose">
                  {total.toLocaleString()} {lang === "ar" ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-brand-rose text-white font-bold text-sm hover:bg-brand-deep transition-all shadow-md disabled:opacity-60"
            >
              {submitting
                ? lang === "ar"
                  ? "جاري تأكيد الطلب..."
                  : "Placing Order..."
                : lang === "ar"
                ? "تأكيد الطلب الآن"
                : "Confirm Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
