"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import { auth, db, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, writeBatch } from "./firebase";
import { Prospect, Message } from "./types";
import { INITIAL_PROSPECTS } from "./data";

interface DashboardContextType {
  prospects: Prospect[];
  isLoadingProspects: boolean;
  activeCount: number;
  addProspect: (prospect: Omit<Prospect, "id" | "createdAt">) => Promise<void>;
  updateStatus: (id: string, status: Prospect["status"]) => Promise<void>;
  updateProspect: (id: string, fields: Partial<Prospect>) => Promise<void>;
  deleteProspect: (id: string) => Promise<void>;
  coachMessages: Message[];
  isCoachLoading: boolean;
  sendCoachMessage: (text: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  prospects: [],
  isLoadingProspects: false,
  activeCount: 0,
  addProspect: async () => {},
  updateStatus: async () => {},
  updateProspect: async () => {},
  deleteProspect: async () => {},
  coachMessages: [],
  isCoachLoading: false,
  sendCoachMessage: async () => {},
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoadingProspects, setIsLoadingProspects] = useState(false);
  const [coachMessages, setCoachMessages] = useState<Message[]>([
    {
      id: "m0",
      sender: "coach",
      text: "¡Hola! Soy Sofía, tu **Coach de Ventas Inteligente de Nexor**.\n\nEstoy entrenada con miles de casos de automatización comercial. Mi objetivo es ayudarte a cerrar cuentas de Nexor y ganar comisiones recurrentes mensuales.\n\nPregúntame cosas como:\n* *¿Cómo presento Nexor a una inmobiliaria?*\n* *Redacta un mensaje de WhatsApp para el dueño de una automotriz.*\n* *¿Cómo respondo si un cliente dice que la IA es muy fría?*",
      timestamp: new Date(),
    },
  ]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);

  const activeCount = prospects.filter(
    (p) => p.status === "Generando comisiones" || p.status === "Cuenta activada"
  ).length;

  useEffect(() => {
    if (!user) return;
    let unsubProspects: (() => void) | null = null;
    let isSeeding = false;

    const userProspectsRef = collection(db, "users", user.uid, "prospects");
    unsubProspects = onSnapshot(userProspectsRef, async (snapshot) => {
      let list: Prospect[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Prospect);
      });

      if (list.length === 0 && !isSeeding) {
        isSeeding = true;
        setIsLoadingProspects(true);
        try {
          const batch = writeBatch(db);
          for (const p of INITIAL_PROSPECTS) {
            const newDocRef = doc(db, "users", user.uid, "prospects", p.id);
            batch.set(newDocRef, {
              name: p.name,
              company: p.company,
              email: p.email,
              industry: p.industry,
              estimatedValue: p.estimatedValue,
              status: p.status,
              createdAt: p.createdAt,
              leadsBalance: p.leadsBalance ?? 0,
              leadsConsumed: p.leadsConsumed ?? 0,
              invoices: p.invoices ?? [],
              ...(p.commissionEarned ? { commissionEarned: p.commissionEarned } : {}),
            });
          }
          await batch.commit();
        } catch (err) {
          console.error("Error seeding data:", err);
        } finally {
          isSeeding = false;
        }
      } else {
        setProspects(list);
        setIsLoadingProspects(false);
      }
    }, (error) => {
      console.error("Firestore error:", error);
      setIsLoadingProspects(false);
    });

    return () => {
      if (unsubProspects) unsubProspects();
    };
  }, [user]);

  const addProspect = useCallback(async (prospectData: Omit<Prospect, "id" | "createdAt">) => {
    if (!user) return;
    const newId = "p_" + Date.now();
    const newProspect: Prospect = {
      id: newId,
      ...prospectData,
      createdAt: new Date().toISOString().split("T")[0],
    };
    try {
      const docRef = doc(collection(db, "users", user.uid, "prospects"), newId);
      await setDoc(docRef, {
        name: newProspect.name,
        company: newProspect.company,
        email: newProspect.email,
        industry: newProspect.industry,
        estimatedValue: newProspect.estimatedValue,
        status: newProspect.status,
        createdAt: newProspect.createdAt,
        leadsBalance: 100,
        leadsConsumed: 12,
        invoices: [
          { id: "inv_1", amount: 1500, status: "paid", date: newProspect.createdAt },
          { id: "inv_2", amount: 1500, status: "unpaid", date: newProspect.createdAt },
        ],
      });
    } catch (err) {
      console.error("Error adding prospect:", err);
    }
  }, [user]);

  const updateStatus = useCallback(async (id: string, status: Prospect["status"]) => {
    if (!user) return;
    const target = prospects.find((p) => p.id === id);
    if (!target) return;
    try {
      const docRef = doc(db, "users", user.uid, "prospects", id);
      let commissionEarned = target.commissionEarned;
      if (status === "Generando comisiones" || status === "Cuenta activada") {
        const pct = activeCount < 5 ? 0.15 : activeCount < 10 ? 0.20 : 0.25;
        commissionEarned = Math.round(target.estimatedValue * pct);
      } else {
        commissionEarned = undefined;
      }
      await setDoc(docRef, { ...target, status, ...(commissionEarned !== undefined ? { commissionEarned } : {}) }, { merge: true });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }, [user, prospects, activeCount]);

  const updateProspect = useCallback(async (id: string, fields: Partial<Prospect>) => {
    if (!user) return;
    const target = prospects.find((p) => p.id === id);
    if (!target) return;
    try {
      const docRef = doc(db, "users", user.uid, "prospects", id);
      const updated = { ...target, ...fields };
      if (fields.status === "Generando comisiones") {
        const pct = activeCount < 5 ? 0.15 : activeCount < 10 ? 0.20 : 0.25;
        updated.commissionEarned = Math.round(
          (fields.estimatedValue ?? target.estimatedValue) * pct
        );
      }
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.error("Error updating prospect:", err);
    }
  }, [user, prospects, activeCount]);

  const deleteProspect = useCallback(async (id: string) => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid, "prospects", id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting prospect:", err);
    }
  }, [user]);

  const sendCoachMessage = useCallback(async (text: string) => {
    if (!text.trim() || isCoachLoading) return;
    const userMsg: Message = { id: "u_" + Date.now(), sender: "user", text, timestamp: new Date() };
    setCoachMessages((prev) => [...prev, userMsg]);
    setIsCoachLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: coachMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      const coachMsg: Message = { id: "c_" + Date.now(), sender: "coach", text: data.text, timestamp: new Date() };
      setCoachMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: "err_" + Date.now(),
        sender: "coach",
        text: "Hubo un pequeño retraso al consultar con Sofía. ¿Puedes intentarlo de nuevo?",
        timestamp: new Date(),
      };
      setCoachMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsCoachLoading(false);
    }
  }, [coachMessages, isCoachLoading]);

  return (
    <DashboardContext.Provider
      value={{
        prospects,
        isLoadingProspects,
        activeCount,
        addProspect,
        updateStatus,
        updateProspect,
        deleteProspect,
        coachMessages,
        isCoachLoading,
        sendCoachMessage,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
