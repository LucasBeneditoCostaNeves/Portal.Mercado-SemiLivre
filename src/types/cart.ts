export type CartItem = {
  id: string
  quantity: number
  productId: string
  productTitle: string
  productThumbnail: string
  variationId: string
  variationTitle: string
  price: number
  discountPercentage: number
  freeShipping: boolean
  sellerName: string
  sellerId: string
}

export type Cart = {
  items: CartItem[]
}
