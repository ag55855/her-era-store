export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
  image?: string;
}

export interface CategoryDTO {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  image: string | null;
  sortOrder: number;
  _count?: { products: number };
}

export interface ProductDTO {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  category?: CategoryDTO;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  badgeAr: string | null;
  collectionName: string | null;
  inStock: boolean;
  featured: boolean;
  createdAt?: string | Date;
}

export interface CartItem {
  productId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

export interface StoreSettingsDTO {
  id: string;
  instapayHandle: string;
  vodafoneCashNumber: string;
  whatsappNumber: string;
  shippingCairo: number;
  shippingOther: number;
  announcementAr: string;
  announcementEn: string;
}

export const EGYPT_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "القليوبية",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "الغربية",
  "المنوفية",
  "البحيرة",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "كفر الشيخ",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
  "الوادي الجديد",
];
