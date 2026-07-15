"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import SupportPanel from "@/components/SupportPanel";

export default function SupportPage() {
  const { user } = useAuth();
  return <SupportPanel userEmail={user?.email || "partner@nexor.ai"} />;
}
