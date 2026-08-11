"use client";

import { useEffect } from "react";
import { clearSession } from "@/lib/clientStorage";

/** Clears the in-progress test session once payment has completed. */
export function ClearSessionOnMount() {
  useEffect(() => {
    clearSession();
  }, []);
  return null;
}
