export type FavoriteItem = {
  favoriteId: string
  productId: string
  title: string
  thumbnail: string
  price: number | null
  discountPercentage: number | null
  createdAt: string
}

export type FavoritesList = {
  total: number
  page: number
  limit: number
  items: FavoriteItem[]
}

export type FavoriteStatus = {
  isFavorite: boolean
  favoriteId: string | null
}
