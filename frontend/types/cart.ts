export interface CartItemExtensions {
  cakeMessage: string;
  deliveryPincode: string;
  deliveryDate: string;
  deliverySlot: string;
  deliveryZone: string;
}

export interface CartItemImage {
  src: string;
  alt: string;
  thumbnail?: string;
}

export interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink: string;
  image: CartItemImage;
  lineTotal: string;
  lineTotalMinor: number;
  unitPrice: string;
  extensions: CartItemExtensions;
}

export interface CartTotals {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  subtotalMinor: number;
  shippingMinor: number;
  taxMinor: number;
  totalMinor: number;
  currencyCode: string;
  taxLabel: string;
}

export interface Cart {
  items: CartItem[];
  totals: CartTotals;
  itemsCount: number;
  needsShipping: boolean;
  hasCalculatedShipping: boolean;
}

export interface CartResponse {
  cart: Cart;
  itemsCount: number;
}

export interface DeliveryMetaConflict {
  hasConflict: boolean;
  message: string;
}
