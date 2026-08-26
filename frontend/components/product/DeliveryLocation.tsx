"use client";

import { useState } from "react";
import { validatePincode } from "@/lib/wordpress/delivery";

interface DeliveryLocationProps {
  pincode: string;
  onPincodeChange: (value: string) => void;
  onValidated: (serviceable: boolean, zone: string) => void;
}

export function DeliveryLocation({
  pincode,
  onPincodeChange,
  onValidated,
}: DeliveryLocationProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleCheck() {
    setStatus("loading");
    setMessage("");

    try {
      const result = await validatePincode(pincode);
      setStatus(result.serviceable ? "success" : "error");
      setMessage(result.message);
      onValidated(result.serviceable, result.zone);
    } catch {
      setStatus("error");
      setMessage("Unable to check pincode. Please try again.");
      onValidated(false, "");
    }
  }

  return (
    <div>
      <p className="text-sm uppercase tracking-viola text-viola-accent">
        Delivery Location
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(event) => {
            onPincodeChange(event.target.value.replace(/\D/g, ""));
            setStatus("idle");
            setMessage("");
          }}
          placeholder="Enter Pincode"
          className="h-12 w-full border border-viola-border px-4 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={pincode.length !== 6 || status === "loading"}
          className="h-12 shrink-0 border border-viola-primary bg-viola-primary px-5 text-sm tracking-viola-wide text-white transition-colors hover:bg-[#5a1a72] disabled:opacity-50 sm:px-6 sm:text-base"
        >
          {status === "loading" ? "Checking..." : "Check Availability"}
        </button>
      </div>
      {message ? (
        <p
          className={`mt-2 text-sm tracking-viola-wide ${
            status === "success" ? "text-viola-primary" : "text-red-600"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
