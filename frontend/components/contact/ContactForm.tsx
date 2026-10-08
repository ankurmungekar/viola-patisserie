"use client";

import { useState } from "react";

const fieldClassName =
  "h-12 w-full border border-viola-border px-4 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, message, website }),
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to send your message.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        className={fieldClassName}
        required
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className={fieldClassName}
        required
      />
      <input
        type="tel"
        value={phone}
        onChange={(event) =>
          setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
        }
        placeholder="Phone (optional)"
        className={fieldClassName}
      />
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="How can we help?"
        rows={6}
        className="w-full border border-viola-border px-4 py-3 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none"
        required
      />

      {error ? (
        <p className="text-sm tracking-viola-wide text-red-600">{error}</p>
      ) : null}
      {success ? (
        <p className="text-sm tracking-viola-wide text-viola-primary">
          Thank you. We have received your message and will get back to you
          soon.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center bg-viola-primary px-6 text-xl tracking-viola-wide text-white transition-colors hover:bg-[#5a1a72] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
      >
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
