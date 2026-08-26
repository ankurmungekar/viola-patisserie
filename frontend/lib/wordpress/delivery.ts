import {
  deliveryDefaults,
  getMockDeliverySlots,
  validateMockPincode,
} from "@/lib/config/delivery-defaults";
import { getWordPressUrl } from "@/lib/woocommerce/client";
import type {
  DeliverySlotsResponse,
  PincodeValidationResult,
} from "@/types/delivery";

export async function validatePincode(
  pincode: string,
): Promise<PincodeValidationResult> {
  const url = new URL(
    "/wp-json/viola/v1/delivery/validate-pincode",
    getWordPressUrl(),
  );

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pincode }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Pincode validation failed: ${response.status}`);
    }

    return (await response.json()) as PincodeValidationResult;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[delivery] Falling back to mock pincode validation:", error);
    }

    return validateMockPincode(pincode);
  }
}

export async function getDeliverySlots(
  pincode: string,
  from?: string,
): Promise<DeliverySlotsResponse> {
  const url = new URL("/wp-json/viola/v1/delivery/slots", getWordPressUrl());
  url.searchParams.set("pincode", pincode);

  if (from) {
    url.searchParams.set("from", from);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Delivery slots failed: ${response.status}`);
    }

    return (await response.json()) as DeliverySlotsResponse;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[delivery] Falling back to mock delivery slots:", error);
    }

    const fromDate = from ? new Date(from) : new Date();
    return getMockDeliverySlots(fromDate);
  }
}

export { deliveryDefaults };
