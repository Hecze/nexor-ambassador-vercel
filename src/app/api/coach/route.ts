import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
      },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "El mensaje es requerido." }, { status: 400 });
    }

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        text: `[Modo de demostración: Sin API Key] Hola, soy tu Coach de Ventas de Nexor. Me has preguntado: "${message}". En producción, te redactaría una respuesta con base en la industria correspondiente, usando nuestro propio motor de inteligencia artificial. ¡Registra tu API Key en Secrets para probarlo de manera real!`,
      });
    }

    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: { sender: string; text: string }) => {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const systemInstruction = `Eres el Agente IA 'Coach de Ventas' de Nexor, entrenado para empoderar y capacitar a nuestros partners y embajadores (agencias de marketing, consultores de ventas y referentes B2B) en 10 países. Nexor es un ecosistema de automatización inteligente que califica e interactúa con leads de inmediato las 24 horas del día por múltiples canales (Llamada, WhatsApp, Email, Instagram, Facebook, SMS) sin reemplazar las herramientas actuales (HubSpot, Salesforce, Pipedrive, Zoho, CSV). 

Tu misión es ayudar al embajador a cerrar tratos y ser 100% independiente.
Cuando el embajador te pregunte sobre cómo pitchear a una empresa de cierto sector (ej. automotriz, inmobiliaria, educación, seguros, saas, salud, retail):
1. Redacta el argumento perfecto (un pitch de elevador convincente centrado en el ROI y automatización).
2. Proporciona una plantilla de WhatsApp de primer contacto directa y atractiva para copiar.
3. Proporciona una plantilla de correo electrónico corta de seguimiento.
4. Explica cómo rebatir objeciones típicas ("ya tengo un equipo", "es muy caro", "no confío en IA").

Usa un tono profesional, inspirador, estratégico y sumamente comercial. Responde en español de forma estructurada usando Markdown con emojis sutiles.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: unknown) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud con el Coach de Ventas." },
      { status: 500 }
    );
  }
}
