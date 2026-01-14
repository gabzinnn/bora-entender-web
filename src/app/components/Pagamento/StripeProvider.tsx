"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { type ReactNode } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#13ec13",
    colorBackground: "#ffffff",
    colorText: "#101718",
    colorDanger: "#ff4d2e",
    fontFamily: "Manrope, sans-serif",
    borderRadius: "8px",
  },
  rules: {
    ".Input": {
      border: "1px solid #dbe6db",
      boxShadow: "none",
      padding: "12px",
    },
    ".Input:focus": {
      border: "1px solid #13ec13",
      boxShadow: "0 0 0 1px #13ec13",
    },
    ".Label": {
      fontWeight: "600",
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
  },
};

interface StripeProviderProps {
  children: ReactNode;
  clientSecret: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  return (
    <Elements 
      stripe={stripePromise} 
      options={{ clientSecret, appearance }}
    >
      {children}
    </Elements>
  );
}