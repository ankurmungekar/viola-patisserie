export function formatCartDeliveryDate(dateValue: string): string {
  if (!dateValue) {
    return "";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const formatted = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  if (target.getTime() === tomorrow.getTime()) {
    return `${formatted} ( Tomorrow)`;
  }

  return formatted;
}

export function formatCartDeliverySlot(slot: string): string {
  if (!slot) {
    return "";
  }

  return slot.replace(/\s*-\s*/g, "- ");
}
