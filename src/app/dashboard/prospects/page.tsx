"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";
import { TIERS } from "@/lib/data";
import CrmDashboard from "@/components/CrmDashboard";
import CompaniesPanel from "@/components/CompaniesPanel";

export default function ProspectsPage() {
  const searchParams = useSearchParams();
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
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fromQuery = searchParams.get("selected");
    if (fromQuery && prospects.some((p) => p.id === fromQuery)) {
      setSelectedCompanyId(fromQuery);
      return;
    }
    if (prospects.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(prospects[0].id);
    }
  }, [prospects.length, searchParams]);

  const currentTier = activeCount < 5 ? TIERS[0] : activeCount < 10 ? TIERS[1] : TIERS[2];

  if (isLoadingProspects) return <Skeletons />;

  return (
    <div className="flex h-full -ml-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <CompaniesPanel
        prospects={prospects}
        selectedProspectId={selectedCompanyId}
        onSelect={setSelectedCompanyId}
        onAddProspect={addProspect}
      />
      <div className="flex-1 min-w-0 overflow-y-auto bg-[#F6F6F7] pl-4">
        <CrmDashboard
          selectedProspectId={selectedCompanyId}
          onClearSelection={() => setSelectedCompanyId(null)}
          prospects={prospects}
          onAddProspect={addProspect}
          onUpdateStatus={updateStatus}
          onUpdateProspect={updateProspect}
          onDeleteProspect={deleteProspect}
          currentTierName={currentTier.name}
          currentUser={user}
        />
      </div>
    </div>
  );
}

function Skeletons() {
  return (
    <div className="flex h-full">
      <div className="w-[272px] min-w-[272px] bg-white border-r border-[#E8E8EA] animate-pulse p-3.5 space-y-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-[72px] bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="flex-1 p-4 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-64" />
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-14 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
