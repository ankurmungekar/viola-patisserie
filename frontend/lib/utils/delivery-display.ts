import { getDeliverySlots } from "@/lib/wordpress/delivery";

export async function resolveDeliverySlotLabel(
  pincode: string,
  date: string,
  slotId: string,
): Promise<string> {
  if (!slotId) {
    return "";
  }

  if (!pincode || !date) {
    return slotId;
  }

  try {
    const response = await getDeliverySlots(pincode, date);
    const dateOption = response.dates.find((entry) => entry.date === date);
    const slot = dateOption?.slots.find((entry) => entry.id === slotId);

    return slot?.label ?? slotId;
  } catch {
    return slotId;
  }
}
