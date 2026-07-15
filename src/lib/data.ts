import { Tier, FAQItem, ResourceTemplate, Prospect } from "./types";

export const TIERS: Tier[] = [
  {
    name: "Explorer Partner",
    companiesRequired: "Al unirse al programa",
    commission: "15% de la suscripción (MRR)",
    networkOverride: "5% de sub-partners",
    color: "from-slate-100 to-slate-200 text-slate-800 border-slate-300",
    benefits: [
      "Acceso completo al Portal de Partners de Nexor",
      "Librería de recursos de ventas y plantillas por industria",
      "Soporte del Agente IA Sales Coach las 24 horas",
      "Enlace de afiliado único para rastreo automático",
    ],
  },
  {
    name: "Growth Partner",
    companiesRequired: "A partir de 5 cuentas activas",
    commission: "20% de la suscripción (MRR)",
    networkOverride: "8% de sub-partners",
    color: "from-blue-50 to-blue-100 text-blue-900 border-blue-200",
    benefits: [
      "Comisión incrementada al 20% del valor total de la suscripción (MRR)",
      "Soporte preferente con el equipo técnico de Nexor",
      "Entorno prioritario para levantar demos a gran escala",
      "Acceso a webinars de co-marketing y leads calificados",
    ],
  },
  {
    name: "Elite Partner",
    companiesRequired: "Más de 10 cuentas activas",
    commission: "25% de la suscripción (MRR)",
    networkOverride: "10% de sub-partners",
    color: "from-neutral-900 to-neutral-850 text-white border-neutral-800",
    benefits: [
      "Comisión máxima del 25% de la suscripción mensual recurrente (MRR)",
      "Acceso anticipado a nuevas funcionalidades e integraciones de IA",
      "Socio en el programa de referidos oficiales (Nexor redirige clientes)",
      "Manager de cuenta dedicado y canal directo en Slack",
    ],
  },
];

export const FAQS: FAQItem[] = [
  {
    question: "¿Cómo se rastrean las ventas de mis referidos?",
    answer: "Cada embajador recibe un enlace de afiliado único en su portal. Cuando un prospecto hace clic en tu enlace, se guarda una cookie por 90 días. También puedes registrar al prospecto manualmente en tu Mini-CRM para asegurar la atribución de la cuenta incluso si cierran la venta por llamada.",
  },
  {
    question: "¿Cuándo y cómo recibo mis comisiones?",
    answer: "Las comisiones se calculan a mes vencido sobre la facturación de leads de tus referidos y se pagan los primeros 10 días de cada mes. Ofrecemos transferencias bancarias internacionales directas, PayPal, Stripe Connect y criptomonedas (USDT/USDC). No hay límites mínimos elevados para retirar.",
  },
  {
    question: "¿Los clientes que refiero reciben algún beneficio?",
    answer: "Sí. Los clientes que se registran a través de un embajador oficial de Nexor reciben un 10% de descuento en sus primeros 3 meses de facturación por lead, además de una sesión de onboarding prioritario para configurar su primer agente de IA.",
  },
  {
    question: "¿En qué países opera Nexor?",
    answer: "Nexor es una plataforma global. Operamos y soportamos integraciones locales en más de 10 países de Iberoamérica, incluyendo México, Colombia, España, Argentina, Chile, Perú, Ecuador, Uruguay, Paraguay y Panamá.",
  },
  {
    question: "¿Qué es el 'Network Override' (Comisión de Red)?",
    answer: "Es un incentivo para expandir la red. Si invitas a otras agencias o consultores a ser partners de Nexor (con tu enlace de reclutamiento), ganarás un porcentaje adicional de la facturación por lead que ellos generen (entre 5% y 10% dependiendo de tu nivel), sin restar comisiones a tu sub-partner.",
  },
  {
    question: "¿Tengo que pagar para ser partner de Nexor?",
    answer: "No. El programa de Partners de Nexor es 100% gratuito. Nuestro objetivo es crecer juntos: nosotros te damos la tecnología e independencia operativa, y tú nos abres las puertas de nuevos mercados.",
  },
];

export const RESOURCE_TEMPLATES: ResourceTemplate[] = [
  {
    id: "auto-wa",
    title: "Contacto por WhatsApp - Sector Automotriz",
    description: "Mensaje directo de prospección para concesionarios de autos o agencias de vehículos.",
    category: "WhatsApp",
    industry: "Automotriz",
    content: `Hola [Nombre del Contacto], estuve revisando los canales digitales de [Nombre del Concesionario] y noté que reciben un alto flujo de consultas los fines de semana y por las noches, cuando el equipo de ventas está libre.

Estamos implementando un sistema de IA específico para automotrices que califica al cliente, cotiza el modelo de interés y le agenda la prueba de manejo en el calendario del asesor, de inmediato las 24 horas.

Logramos que agencias promedio incrementen sus test drives agendados en un 38% en las primeras dos semanas. 

¿Te interesaría ver una demo rápida de 3 minutos de cómo funcionaría con sus propios modelos?`,
  },
  {
    id: "re-email",
    title: "Correo de Prospección - Inmobiliarias",
    description: "Correo enfocado en la velocidad de respuesta para brokers y desarrolladoras inmobiliarias.",
    category: "Email",
    industry: "Inmobiliaria",
    content: `Asunto: El problema del "lead frío" en [Nombre de la Inmobiliaria] - Demo de IA

Hola [Nombre del Contacto],

En el sector inmobiliario sabemos que un lead que no se responde en los primeros 5 minutos pierde un 80% de probabilidad de conversión. La mayoría de los portales envían prospectos los fines de semana y el equipo comercial los contacta hasta el lunes por la tarde.

Ayudamos a desarrolladoras y agencias a conectar sus fuentes de leads (Inmuebles24, Idealista, Facebook Ads, etc.) con un agente de IA que interactúa por WhatsApp en menos de 30 segundos: califica el presupuesto del cliente, su zona de interés, y agenda visitas directo con tus brokers.

He preparado una demo funcional simulada para [Nombre de la Inmobiliaria]. Puedes verla aquí: [Enlace de Demo]

¿Te interesaría tener una breve videollamada de 10 minutos esta semana para ver los números de retorno de inversión de otras inmobiliarias en la región?

Atentamente,
[Tu Nombre]`,
  },
  {
    id: "saas-wa",
    title: "WhatsApp Corto - Empresas de Software / B2B",
    description: "Propuesta de valor ágil para fundadores o directores de ventas de tecnología.",
    category: "WhatsApp",
    industry: "SaaS",
    content: `Hola [Nombre del Contacto], ¿cómo va? Veo que en [Nombre de la Empresa] están escalando fuerte su captación B2B. 

Ayudamos a empresas SaaS a eliminar la fricción de los formularios de contacto tradicionales. Integramos un agente conversacional de IA (con tecnología Nexor) que califica el presupuesto y volumen del lead de inmediato en tu web y, si cumple con el perfil de cliente ideal, lo agenda de forma inteligente en el calendario de tus Account Executives de inmediato.

Filtramos leads no calificados en un 60% y duplicamos la tasa de reserva de demos. 

¿Te queda bien una breve llamada mañana por la tarde para mostrarte la calculadora de ROI?`,
  },
  {
    id: "est-email",
    title: "Propuesta de Automatización - Clínicas y Salud",
    description: "Enfoque en reducción de ausentismo y confirmación automática de turnos por WhatsApp.",
    category: "Email",
    industry: "Salud/Estética",
    content: `Asunto: Automatización de agenda y reducción de ausentismo para [Nombre de la Clínica]

Hola [Nombre del Contacto],

Me pongo en contacto porque ayudamos a centros de salud y clínicas estéticas a resolver dos grandes problemas operativos: el tiempo invertido en coordinar turnos manualmente por WhatsApp y el ausentismo de pacientes de última hora.

Con Nexor, implementamos un agente de IA entrenado con tus tratamientos, tarifas y agenda. El agente:
1. Responde preguntas comunes las 24 horas.
2. Agenda citas en tiempo real integrándose con tu software actual.
3. Envía recordatorios automáticos y re-agenda de inmediato si el paciente cancela, llenando los espacios vacíos de tu equipo médico.

Esto suele liberar el 70% del tiempo del personal de recepción y reduce el ausentismo en un 25%.

Me encantaría enviarte un video de 2 minutos que muestra el bot en acción agendando un turno estético ficticio para tu clínica. ¿Le echas un ojo?

Saludos cordiales,
[Tu Nombre]`,
  },
];

export const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: "p1",
    name: "Carlos Mendoza",
    company: "Automotores del Sur",
    email: "carlos.mendoza@autosur.com",
    industry: "Automotriz",
    estimatedValue: 900,
    status: "Generando comisiones",
    createdAt: "2026-06-12",
    commissionEarned: 135,
    leadsBalance: 15,
    leadsConsumed: 45,
    invoices: [
      { id: "FAC-101", amount: 300, leadsAmount: 20, date: "2026-06-12", status: "Pagado" },
      { id: "FAC-102", amount: 600, leadsAmount: 40, date: "2026-07-01", status: "Pagado" }
    ]
  },
  {
    id: "p2",
    name: "Mariana Silva",
    company: "Inversiones Cumbres",
    email: "msilva@cumbresre.mx",
    industry: "Inmobiliaria",
    estimatedValue: 600,
    status: "Cuenta activada",
    createdAt: "2026-06-28",
    commissionEarned: 60,
    leadsBalance: 8,
    leadsConsumed: 32,
    invoices: [
      { id: "FAC-201", amount: 600, leadsAmount: 40, date: "2026-06-28", status: "Pagado" }
    ]
  },
  {
    id: "p3",
    name: "Eduardo Gómez",
    company: "SaaS Metrics Co",
    email: "eduardo@metrics.io",
    industry: "SaaS",
    estimatedValue: 300,
    status: "Demo creada",
    createdAt: "2026-07-02",
    leadsBalance: 20,
    leadsConsumed: 0,
    invoices: [
      { id: "FAC-301", amount: 300, leadsAmount: 20, date: "2026-07-02", status: "Pagado" }
    ]
  },
  {
    id: "p4",
    name: "Dra. Sofía Ortega",
    company: "Clínica Dental DentalEstetik",
    email: "sortega@dentalestetik.cl",
    industry: "Salud/Estética",
    estimatedValue: 0,
    status: "Reunión programada",
    createdAt: "2026-07-08",
    leadsBalance: 0,
    leadsConsumed: 0,
    invoices: [
      { id: "FAC-401", amount: 300, leadsAmount: 20, date: "2026-07-08", status: "Pendiente", paymentLink: "https://checkout.nexor.ai/pay/FAC-401" }
    ]
  },
  {
    id: "p5",
    name: "Alejandro Ruiz",
    company: "Inmobiliaria Horizons",
    email: "aruiz@horizons.com.ar",
    industry: "Inmobiliaria",
    estimatedValue: 0,
    status: "Link enviado",
    createdAt: "2026-07-12",
    leadsBalance: 0,
    leadsConsumed: 0,
    invoices: []
  },
];
