export type ProductBadge = "OFERTA" | "NOVO";

export type Product = {
  id: string;
  title: string;
  price: number;
  installments: string;
  freeShipping: boolean;
  rating: number;
  reviewCount: number;
  icon: string;
  imageUrl: string;
  badge?: ProductBadge;
};

export type ProductVariationDetail = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  discountPercentage: number;
};

export type ProductDetail = {
  id: string;
  title: string;
  price: number;
  installments: string;
  freeShipping: boolean;
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  imageUrl: string;
  images: string[];
  description: string;
  warrantyInformation: string;
  brand: string;
  category: string;
  seller: string;
  variations: ProductVariationDetail[];
};

export type Department = {
  id: string;
  label: string;
  icon: string;
};

export type PromoCard = {
  id: string;
  variant: "yellow" | "blue";
  icons: string[];
  title: string;
  description: string;
  cta: string;
};
