import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { profileUrl, clientName } = await req.json();
    const name = clientName || "Contacto Corporativo";

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isTech = name.toLowerCase().includes("marcus") || name.toLowerCase().includes("ing") || name.toLowerCase().includes("dev") || name.toLowerCase().includes("tech") || name.toLowerCase().includes("cto");
    const isCommercial = name.toLowerCase().includes("valen") || name.toLowerCase().includes("ventas") || name.toLowerCase().includes("director") || name.toLowerCase().includes("vender") || name.toLowerCase().includes("comercial") || name.toLowerCase().includes("cmo");

    const scrapedData = {
      name,
      role: isTech ? "VP de Ingeniería" : isCommercial ? "Directora Comercial" : "Director General / CEO",
      company: isTech ? "Northwind Logistics" : isCommercial ? "Cumbres Del Valle" : "Global Distribution S.A.",
      industry: isTech ? "SaaS & Logística" : isCommercial ? "Inmobiliaria & Preventa" : "Servicios Financieros B2C",
      employeeCount: isTech ? "500-1000 empleados" : isCommercial ? "50-200 empleados" : "10-50 empleados (PyME)",
      experience: "Ex-integrador de plataformas y arquitecto Cloud. Enfocado en la reducción de costos operativos (TCO) y automatización de flujos conversacionales.",
      objectionsExpected: isTech
        ? ["Seguridad y privacidad de los datos en llamadas con IA", "Complejidad técnica de integrar agentes con sistemas legacy", "Costo de implementación vs Vambe"]
        : ["Empatía en la preventa inmobiliaria", "Calidez de la voz artificial chilena", "Tasa de conversión real vs asesores presenciales"],
      goalsSuggested: isTech
        ? ["Usar la 'Técnica del Eco' antes de responder a las objeciones de TCO", "Preguntar el número exacto de herramientas en su stack", "Agendar un paso siguiente en firme dentro de los próximos 30 días"]
        : ["Validar el canal de procedencia de sus leads", "Explicar que la IA automatiza el filtro inicial en 60 segundos", "Agendar una visita técnica para ver la integración en vivo"],
    };

    return NextResponse.json(scrapedData);
  } catch (error: unknown) {
    console.error("Error scraping profile with Apify:", error);
    return NextResponse.json({ error: "Error al simular el scrape de Apify." }, { status: 500 });
  }
}
