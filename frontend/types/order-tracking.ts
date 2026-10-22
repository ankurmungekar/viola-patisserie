export interface OrderTrackingStep {
  id: string;
  label: string;
  state: "done" | "current" | "upcoming";
}

export interface OrderTracking {
  orderNumber: string;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  statusLabel: string;
  detail: string;
  placedAt: string;
  delivery: { date: string; slot: string } | null;
  items: { name: string; quantity: number; cakeMessage: string }[];
  total: string;
  tracking: { number: string; url: string; carrier: string } | null;
  steps: OrderTrackingStep[];
}
