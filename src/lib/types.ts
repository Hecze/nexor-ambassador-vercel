export interface Invoice {
  id: string;
  amount: number;
  leadsAmount: number;
  date: string;
  status: "Pagado" | "Pendiente";
  paymentLink?: string;
  concept?: string;
}

export interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  industry: string;
  estimatedValue: number;
  status: "Link enviado" | "Reunión programada" | "Demo creada" | "Cuenta activada" | "Generando comisiones";
  createdAt: string;
  commissionEarned?: number;
  leadsBalance?: number;
  leadsConsumed?: number;
  invoices?: Invoice[];
}

export interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

export interface ResourceTemplate {
  id: string;
  title: string;
  description: string;
  category: "WhatsApp" | "Email" | "Puntos Clave";
  industry: string;
  content: string;
}

export interface Tier {
  name: string;
  companiesRequired: string;
  commission: string;
  networkOverride: string;
  color: string;
  benefits: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
