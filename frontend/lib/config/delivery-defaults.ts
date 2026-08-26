import type {
  DeliverySlotsResponse,
  PincodeValidationResult,
} from "@/types/delivery";

export const deliveryDefaults = {
  serviceablePincodes: [
    "400001",
    "400002",
    "400003",
    "400004",
    "400005",
    "400006",
    "400007",
    "400008",
    "400009",
    "400010",
    "400011",
    "400012",
    "400013",
    "400014",
    "400015",
    "400016",
    "400017",
    "400018",
    "400019",
    "400020",
    "400021",
    "400022",
    "400024",
    "400025",
    "400026",
    "400027",
    "400028",
    "400029",
    "400030",
    "400031",
    "400032",
    "400033",
    "400034",
    "400035",
    "400037",
    "400042",
    "400043",
    "400049",
    "400050",
    "400051",
    "400052",
    "400053",
    "400054",
    "400055",
    "400056",
    "400057",
    "400058",
    "400059",
    "400060",
    "400061",
    "400062",
    "400063",
    "400064",
    "400065",
    "400066",
    "400067",
    "400068",
    "400069",
    "400070",
    "400071",
    "400072",
    "400074",
    "400075",
    "400076",
    "400077",
    "400078",
    "400079",
    "400080",
    "400081",
    "400082",
    "400083",
    "400084",
    "400085",
    "400086",
    "400087",
    "400088",
    "400089",
    "400090",
    "400091",
    "400092",
    "400093",
    "400094",
    "400095",
    "400096",
    "400097",
    "400098",
    "400099",
    "400101",
    "400102",
    "400103",
    "400104",
  ],
  leadTimeDays: 1,
  cutoffHour: 18,
  timeSlots: [
    { id: "10:00-13:00", label: "10:00 AM – 1:00 PM" },
    { id: "13:00-16:00", label: "1:00 PM – 4:00 PM" },
    { id: "16:00-19:00", label: "4:00 PM – 7:00 PM" },
  ],
  blackoutDates: [] as string[],
};

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getMockDeliverySlots(fromDate = new Date()): DeliverySlotsResponse {
  const now = new Date();
  const afterCutoff = now.getHours() >= deliveryDefaults.cutoffHour;
  const startOffset = deliveryDefaults.leadTimeDays + (afterCutoff ? 1 : 0);
  const dates: DeliverySlotsResponse["dates"] = [];

  for (let index = 0; index < 7; index += 1) {
    const date = addDays(fromDate, startOffset + index);
    const dateKey = toDateKey(date);

    if (deliveryDefaults.blackoutDates.includes(dateKey)) {
      continue;
    }

    dates.push({
      date: dateKey,
      label: formatDateLabel(date),
      slots: deliveryDefaults.timeSlots.map((slot) => ({
        id: slot.id,
        label: slot.label,
        available: true,
      })),
    });
  }

  return { dates };
}

export function validateMockPincode(pincode: string): PincodeValidationResult {
  const normalized = pincode.trim();

  if (!/^\d{6}$/.test(normalized)) {
    return {
      serviceable: false,
      zone: "",
      message: "Please enter a valid 6-digit pincode.",
    };
  }

  const serviceable = deliveryDefaults.serviceablePincodes.includes(normalized);

  return {
    serviceable,
    zone: serviceable ? "mumbai" : "",
    message: serviceable
      ? "Great news! We deliver to your area."
      : "Sorry, we do not deliver to this pincode yet.",
  };
}
