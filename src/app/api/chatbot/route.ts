import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: { headers: { "User-Agent": "nexor-chatbot" } },
    });
  }
  return aiClient;
}

const SYSTEM = `Eres Nexi, el asistente virtual de Nexor AI. Nexor es un ecosistema de automatización inteligente que califica e interactúa con leads 24/7 por Llamada, WhatsApp, Email, Instagram, Facebook y SMS. Se integra con HubSpot, Salesforce, Pipedrive, Zoho y CSVs.

Tu misión es ayudar a partners/embajadores de Nexor con:
- Dudas sobre la plataforma (cómo usar el CRM, calculadora ROI, simulador de ventas, coach Sofía)
- Estrategias de ventas para distintos sectores (automotriz, inmobiliario, SaaS, salud)
- Problemas técnicos y de navegación
- Información sobre comisiones y niveles de partner (Explorer 15%, Growth 20%, Elite 25%)

Reglas:
1. Sé conciso, cálido y profesional. Responde en español.
2. Si no puedes resolver algo, sugiere crear un ticket en la sección de Soporte.
3. Usa emojis discretos para dar calidez.
4. No inventes datos. Si no sabes algo, dilo.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido." }, { status: 400 });
    }

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        text: "¡Hola! 👋 Soy Nexi, tu asistente virtual. Actualmente estoy en modo demo porque no se ha configurado una API Key de Gemini. Pregúntame lo que necesites.",
      });
    }

    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents,
      config: { systemInstruction: SYSTEM, temperature: 0.5 },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: unknown) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { text: "Perdón, tuve un error procesando tu mensaje. ¿Puedes intentarlo de nuevo? Si el problema persiste, crea un ticket en Soporte." },
      { status: 500 }
    );
  }
}
