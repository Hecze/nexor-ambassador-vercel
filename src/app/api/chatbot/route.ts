import { NextRequest, NextResponse } from "next/server";

const REFERRAL_SYSTEM = `Eres Sofía, la asistente comercial de IA de Nexor. Estás hablando con un posible cliente que fue referido por un partner de Nexor. Tu objetivo es recolectar información clave sobre su empresa de forma natural y conversacional.

DATOS QUE DEBES EXTRAER (pregunta uno por uno, sin ser robótica):
1. Nombre de la empresa
2. Industria / rubro
3. Cargo de la persona con la que hablas
4. Cantidad aproximada de leads que reciben por día
5. Tiempo promedio de respuesta actual a un lead
6. Si sienten que responder manualmente les quita mucho tiempo (mucho, poco, regular)
7. Herramientas que usan actualmente (CRM, WhatsApp, email, etc.)

REGLAS:
- Sé cálida, profesional y conversacional. Pareces una persona real interesada en ayudar.
- Haz UNA sola pregunta a la vez. No bombardees con listas.
- Confirma o parafrasea lo que te dicen antes de pasar a la siguiente pregunta.
- Cuando hayas recolectado TODOS los 7 puntos anteriores, termina la conversación con un mensaje cálido de despedida que incluya exactamente la frase "REGISTRO_COMPLETADO" en algún lugar del mensaje (no visible como código, sino integrado naturalmente).
- Ejemplo de despedida: "¡Perfecto! Ya tengo todo lo que necesito sobre [Empresa]. Voy a preparar una demo personalizada de Nexor para que veas cómo podemos ayudarte con tus [X] leads diarios. Un asesor te contactará pronto. ¡Gracias por tu tiempo! REGISTRO_COMPLETADO"
- NUNCA uses la frase REGISTRO_COMPLETADO antes de tener los 7 datos.
- Si el usuario te pregunta algo sobre precios o funcionalidades que no sabes, dile que un asesor especializado le dará esos detalles.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, partnerId } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        text: "¡Hola! 👋 Soy Sofía. Estoy en modo demo porque no se ha configurado una API Key. ¡Gracias por tu interés en Nexor!",
      });
    }

    const systemPrompt = partnerId ? REFERRAL_SYSTEM : `Eres Nexi, el asistente virtual de Nexor AI. Nexor es un ecosistema de automatización inteligente que califica e interactúa con leads 24/7. Ayudas a partners con dudas sobre la plataforma, estrategias de ventas, y soporte. Responde en español, sé conciso y profesional.`;

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

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: { text: systemPrompt } },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
        }),
      }
    );

    const data = await res.json();
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar tu mensaje.";

    const finished = text.includes("REGISTRO_COMPLETADO");
    const cleanText = text.replace("REGISTRO_COMPLETADO", "").trim();

    return NextResponse.json({ text: cleanText, registered: finished });
  } catch (error: unknown) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { text: "Perdón, tuve un error. ¿Podemos continuar? Cuéntame de tu empresa." },
      { status: 500 }
    );
  }
}
