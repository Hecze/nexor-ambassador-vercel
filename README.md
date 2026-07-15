# Nexor Ambassador — Next.js on Vercel

Ecosistema de Partners de Nexor. Landing Page pública para captación de embajadores y Portal Privado de habilitación de ventas con CRM local, recursos e IA Sales Coach.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Landing page pública |
| `/dashboard` | Portal privado (autenticación requerida) |
| `/dashboard/prospects` | CRM de cartera de clientes |
| `/dashboard/roi` | Calculadora de ROI y comisiones |
| `/dashboard/coach` | Coach de Ventas IA (Sofía) |
| `/dashboard/simulator` | Simulador de llamadas de ventas |
| `/dashboard/resources` | Biblioteca de plantillas de prospección |
| `/dashboard/videos` | Librería de recursos y capacitación |
| `/dashboard/support` | Soporte con tickets |

## Variables de entorno

| Variable | Descripción |
|---|---|
| `GEMINI_API_KEY` | API Key de Google Gemini AI |

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

El proyecto se despliega automáticamente en Vercel al pushear a `main`.
