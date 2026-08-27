export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface CheckoutFormData extends CheckoutAddress {
  customerNote?: string;
}

export interface PaymentMethod {
  id: string;
  title: string;
  description: string;
}

export interface CheckoutData {
  paymentMethods: PaymentMethod[];
  cart: import("@/types/cart").Cart;
}

export interface PlaceOrderResult {
  orderId: number;
  orderKey: string;
  status: string;
  razorpay: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
  } | null;
}

export interface VerifyPaymentPayload {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  orderId: number;
  status: string;
}
