"use client";

import React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import AiSalesCoach from "@/components/AiSalesCoach";

export default function CoachPage() {
  const { coachMessages, sendCoachMessage, isCoachLoading } = useDashboard();

  return (
    <div className="h-full">
      <AiSalesCoach
        messages={coachMessages}
        onSendMessage={sendCoachMessage}
        isLoading={isCoachLoading}
      />
    </div>
  );
}
