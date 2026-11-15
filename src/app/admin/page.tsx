"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Upload,
  Lock,
  Check,
} from "lucide-react";
import type { CategoryDTO, ProductDTO, StoreSettingsDTO } from "@/lib/types";

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  governorate: string;
  address: string;
  paymentMethod: string;
  paymentReference: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    nameAr: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<"products" | "orders" | "settings">("products");
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [settings, setSettings] = useState<StoreSettingsDTO | null>(null);

  // Add Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [collectionName, setCollectionName] = useState("دفعة شتاء 2026");
  const [badgeAr, setBadgeAr] = useState("وصل حديثاً");
  const [sizesText, setSizesText] = useState("S, M, L, XL");
  const [colorNameAr, setColorNameAr] = useState("الأساسي");
  const [colorHex, setColorHex] = useState("#E57399");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savedToast, setSavedToast] = useState("");

  const checkAuth = async () => {
    const res = await fetch("/api/admin/auth");
    const data = await res.json();
    setAuthenticated(Boolean(data.authenticated));
  };

  const loadAllData = async () => {
    const [pRes, cRes, oRes, sRes] = await Promise.all([
      fetch("/api/products?all=true"),
      fetch("/api/categories"),
      fetch("/api/orders"),
      fetch("/api/settings"),
    ]);
    const [pData, cData, oData, sData] = await Promise.all([
      pRes.json(),
      cRes.json(),
      oRes.json(),
      sRes.json(),
    ]);
    setProducts(pData.products || []);
    setCategories(cData.categories || []);
    if (cData.categories?.length && !categoryId) {
      setCategoryId(cData.categories[0].id);
    }
    setOrders(oData.orders || []);
    if (sData.settings) setSettings(sData.settings);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) loadAllData();
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      const d = await res.json();
      setLoginError(d.error || "كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          setUploadedImages((prev) => [...prev, data.url]);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImages.length) return;
    setSavingProduct(true);
    try {
      const sizes = sizesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameAr,
          nameEn: nameEn || nameAr,
          descriptionAr: descriptionAr || nameAr,
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          categoryId,
          collectionName,
          badgeAr,
          sizes,
          colors: [
            {
              nameAr: colorNameAr || "الأساسي",
              nameEn: colorNameAr || "Default",
              hex: colorHex,
              image: uploadedImages[0],
            },
          ],
          images: uploadedImages,
          featured: true,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNameAr("");
        setNameEn("");
        setDescriptionAr("");
        setPrice("");
        setCompareAtPrice("");
        setUploadedImages([]);
        await loadAllData();
        setSavedToast("تمت إضافة المنتج الجديد بنجاح!");
        setTimeout(() => setSavedToast(""), 3000);
      }
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleStock = async (p: ProductDTO) => {
    await fetch(`/api/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inStock: !p.inStock }),
    });
    loadAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadAllData();
  };

  const handleOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadAllData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSavedToast("تم حفظ الإعدادات بنجاح!");
    setTimeout(() => setSavedToast(""), 3000);
  };

  if (authenticated === null) {
    return (
      <div className="py-24 text-center text-brand-muted">جاري التحميل...</div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-3xl border border-brand-border p-8 shadow-md space-y-5 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-brand-blush text-brand-rose flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-ink">
            لوحة تحكم HER ERA
          </h1>
          <p className="text-xs text-brand-muted">
            أدخلي كلمة مرور الإدارة لإضافة دفعات ملابس جديدة ومتابعة الطلبات
          </p>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور (الافتراضية: HerEra2026!)"
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-cream text-sm text-center focus:outline-none focus:border-brand-rose"
          />
          {loginError && (
            <p className="text-xs font-bold text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-brand-rose text-white font-bold text-sm hover:bg-brand-deep transition-colors"
          >
            دخول للوحة التحكم
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
            إدارة متجر HER ERA
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            أضيفي منتجات أو دفعات جديدة في ثواني، وتابعي الطلبات وأرقام الدفع
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-rose text-white text-sm font-bold shadow-sm hover:bg-brand-deep transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج / دفعة جديدة</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-brand-border bg-white text-xs font-bold text-brand-muted hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-bold">
          <Check className="w-4 h-4" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-border pb-3">
        <button
          onClick={() => setTab("products")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold ${
            tab === "products"
              ? "bg-brand-ink text-white"
              : "bg-white border border-brand-border text-brand-ink"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>المنتجات ({products.length})</span>
        </button>

        <button
          onClick={() => setTab("orders")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold ${
            tab === "orders"
              ? "bg-brand-ink text-white"
              : "bg-white border border-brand-border text-brand-ink"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>الطلبات ({orders.length})</span>
        </button>

        <button
          onClick={() => setTab("settings")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold ${
            tab === "settings"
              ? "bg-brand-ink text-white"
              : "bg-white border border-brand-border text-brand-ink"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات الدفع والشحن</span>
        </button>
      </div>

      {/* Tab 1: Products */}
      {tab === "products" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-brand-border p-4 flex gap-4 items-center shadow-xs"
            >
              <img
                src={(Array.isArray(p.images) && p.images[0]) || "/images/logo.jpg"}
                alt=""
                className="w-20 h-24 rounded-xl object-cover shrink-0 bg-brand-blush"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[11px] font-bold text-brand-rose">
                  {p.category?.nameAr} • {p.collectionName}
                </span>
                <h3 className="text-sm font-bold text-brand-ink line-clamp-1">
                  {p.nameAr}
                </h3>
                <p className="text-sm font-extrabold text-brand-ink">
                  {p.price.toLocaleString()} ج.م
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleToggleStock(p)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      p.inStock
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {p.inStock ? "متوفر" : "نفذت الكمية"}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-1.5 text-brand-muted hover:text-red-600"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Orders */}
      {tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-brand-border p-12 text-center text-brand-muted">
              لا توجد طلبات مسجلة حتى الآن.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-brand-border p-5 space-y-3 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-extrabold text-brand-rose text-base">
                      {order.orderNumber}
                    </span>
                    <span className="mx-2 text-brand-muted">•</span>
                    <span className="font-bold text-sm text-brand-ink">
                      {order.customerName} ({order.customerPhone})
                    </span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatus(order.id, e.target.value)}
                    className="px-3 py-1.5 rounded-full border border-brand-border text-xs font-bold bg-brand-blush"
                  >
                    <option value="PENDING">قيد المراجعة</option>
                    <option value="CONFIRMED">مؤكد</option>
                    <option value="SHIPPED">تم الشحن</option>
                    <option value="DELIVERED">تم التوصيل</option>
                    <option value="CANCELLED">ملغي</option>
                  </select>
                </div>

                <p className="text-xs text-brand-muted">
                  {order.governorate} — {order.address} | الدفع:{" "}
                  <strong>{order.paymentMethod}</strong>{" "}
                  {order.paymentReference ? `(${order.paymentReference})` : ""} | الإجمالي:{" "}
                  <strong className="text-brand-ink">
                    {order.total.toLocaleString()} ج.م
                  </strong>
                </p>

                <div className="flex flex-wrap gap-2">
                  {order.items.map((it) => (
                    <span
                      key={it.id}
                      className="px-3 py-1 rounded-full bg-brand-cream border border-brand-border text-xs"
                    >
                      {it.nameAr} ({it.size} • {it.color}) × {it.quantity}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Settings */}
      {tab === "settings" && settings && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white rounded-3xl border border-brand-border p-6 max-w-2xl space-y-4 shadow-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">حساب InstaPay</label>
              <input
                value={settings.instapayHandle}
                onChange={(e) =>
                  setSettings({ ...settings, instapayHandle: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">رقم فودافون كاش</label>
              <input
                value={settings.vodafoneCashNumber}
                onChange={(e) =>
                  setSettings({ ...settings, vodafoneCashNumber: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">شحن القاهرة والجيزة (ج.م)</label>
              <input
                type="number"
                value={settings.shippingCairo}
                onChange={(e) =>
                  setSettings({ ...settings, shippingCairo: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">شحن باقي المحافظات (ج.م)</label>
              <input
                type="number"
                value={settings.shippingOther}
                onChange={(e) =>
                  setSettings({ ...settings, shippingOther: Number(e.target.value) })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-brand-rose text-white font-bold text-sm hover:bg-brand-deep"
          >
            حفظ الإعدادات
          </button>
        </form>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-brand-ink">
                إضافة منتج أو دفعة جديدة
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-sm font-bold text-brand-muted"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المنتج (عربي) *</label>
                <input
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: دريس تريكو شتوي"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">اسم المنتج (إنجليزي)</label>
                <input
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Winter Knit Dress"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">السعر (ج.م) *</label>
                <input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="950"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">السعر قبل الخصم (اختياري)</label>
                <input
                  type="number"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="1150"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">الفئة *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">اسم الدفعة / الكولكشن</label>
                <input
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="دفعة شتاء 2026"
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">المقاسات (مفصولة بفاصلة)</label>
                <input
                  value={sizesText}
                  onChange={(e) => setSizesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">اسم اللون</label>
                <div className="flex gap-2">
                  <input
                    value={colorNameAr}
                    onChange={(e) => setColorNameAr(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-brand-border text-sm"
                  />
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-brand-border"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">وصف القطعة</label>
              <textarea
                rows={2}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">صور المنتج *</label>
              <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-brand-pink bg-brand-blush/40 cursor-pointer hover:bg-brand-blush">
                <Upload className="w-6 h-6 text-brand-rose mb-1" />
                <span className="text-xs font-bold text-brand-ink">
                  {uploading ? "جاري رفع الصور..." : "اضغطي لاختيار الصور من جهازك"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedImages.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {uploadedImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt=""
                      className="w-16 h-20 rounded-xl object-cover border border-brand-border"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={savingProduct || !uploadedImages.length}
              className="w-full py-3.5 rounded-full bg-brand-rose text-white font-bold text-sm hover:bg-brand-deep disabled:opacity-50"
            >
              {savingProduct ? "جاري الحفظ..." : "نشر المنتج في المتجر"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
