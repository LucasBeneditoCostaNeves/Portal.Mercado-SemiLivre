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
