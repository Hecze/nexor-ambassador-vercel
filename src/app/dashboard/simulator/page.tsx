"use client";

import React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import SalesSimulator from "@/components/SalesSimulator";

export default function SimulatorPage() {
  const { prospects } = useDashboard();
  return <SalesSimulator prospects={prospects} />;
}
