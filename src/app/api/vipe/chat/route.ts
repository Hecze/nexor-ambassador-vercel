import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { clientName, role, industry, employeeCount, companyName, message, history } = await req.json();

    const systemPrompt = `Eres un prospecto comercial difícil y escéptico de llamarte ${clientName}, con el cargo de ${role} en la empresa '${companyName}' que opera en la industria de ${industry} con un tamaño aproximado de ${employeeCount}.
Te ha contactado un vendedor (partner) de la startup de IA 'Nexor'.
Tu empresa actualmente tiene pérdidas por leads de ventas no atendidos y un equipo comercial saturado.
Tu principal competidor en el radar es 'Vambe', pero el vendedor de Nexor te está llamando para convencerte de que implementes los agentes de voz de Nexor.

Tus objeciones son:
- Dudar de la efectividad del agente conversacional de Nexor.
- Que el costo de Nexor es alto (el ticket promedio de Nexor es 6 veces más alto que el de Vambe).
- En caso de tecnología: preocupaciones técnicas de integración.
- En caso de inmobiliaria/B2C: preocupaciones de empatía con los clientes finales.

Reglas de comportamiento:
1. Responde de manera corta, al grano y directa, tal como respondería un ejecutivo ocupado en una llamada telefónica (1 o 2 frases máximo).
2. Si el vendedor te presiona de forma correcta usando datos del ROI, pregunta por la integración o muestra interés de forma sutil.
3. Si el vendedor ofrece un descuento rápido, muéstrate escéptico o pierde el interés.
4. Si el vendedor es convincente, te propone agendar un paso siguiente claro (reunión de 45 min) y demuestra el valor, accede de forma profesional.

Historial de llamada anterior:
${JSON.stringify(history)}`;

    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: { role: "client" | "user"; text: string }) => {
        contents.push({
          role: msg.role === "client" ? "model" : "user",
          parts: [{ text: msg.text }],
        });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ text: `[Simulación Vipe] Entiendo lo que dices de Nexor, pero ¿cómo se integra esto en nuestro stack sin reemplazar Salesforce?` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: unknown) {
    console.error("Vipe interaction error:", error);
    return NextResponse.json({ text: "Perdona, se cortó la llamada. ¿Podrías repetirme eso último?" });
  }
}
