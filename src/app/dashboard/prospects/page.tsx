"use client";

import React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { TIERS } from "@/lib/data";
import CrmDashboard from "@/components/CrmDashboard";

export default function ProspectsPage() {
  const {
    prospects,
    isLoadingProspects,
    activeCount,
    addProspect,
    updateStatus,
    updateProspect,
    deleteProspect,
  } = useDashboard();
  const { user } = useAuth();

  const currentTier = activeCount < 5 ? TIERS[0] : activeCount < 10 ? TIERS[1] : TIERS[2];

  return (
    <div className="space-y-4 animate-fade-in">
      {isLoadingProspects ? (
        <Skeletons />
      ) : (
        <CrmDashboard
          prospects={prospects}
          onAddProspect={addProspect}
          onUpdateStatus={updateStatus}
          onUpdateProspect={updateProspect}
          onDeleteProspect={deleteProspect}
          currentTierName={currentTier.name}
          currentUser={user}
        />
      )}
    </div>
  );
}

function Skeletons() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white border border-gray-150 rounded-2xl p-6 flex items-center space-x-4">
            <div className="p-3 bg-gray-200 rounded-xl h-12 w-12" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-3 w-96 bg-gray-150 rounded" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="grid grid-cols-5 gap-4 py-4 border-b border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-5 bg-gray-200 rounded-full w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-8 bg-gray-150 rounded-xl w-36" />
              <div className="h-3 bg-gray-200 rounded w-20 justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
