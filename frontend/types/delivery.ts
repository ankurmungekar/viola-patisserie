export interface PincodeValidationResult {
  serviceable: boolean;
  zone: string;
  message: string;
}

export interface DeliverySlot {
  id: string;
  label: string;
  available: boolean;
}

export interface DeliveryDateOption {
  date: string;
  label: string;
  slots: DeliverySlot[];
}

export interface DeliverySlotsResponse {
  dates: DeliveryDateOption[];
}
