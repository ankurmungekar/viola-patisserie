import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/utils/format-price";

describe("formatPrice", () => {
  it("formats INR without decimals", () => {
    expect(formatPrice(1899)).toBe("₹ 1899");
    expect(formatPrice(500)).toBe("₹ 500");
  });
});
