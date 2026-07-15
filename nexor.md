# Contexto del Reto - Nexor Embassador

## Introducción
Este repositorio contiene el dashboard de autoatención para los vendedores externos (partners/embajadores) de **Nexor**.

## Contexto de la Startup
**Nexor** es una nueva startup en Silicon Valley que opera con un equipo interno extremadamente reducido (apenas 10 personas). Para escalar globalmente, se apoya en una red de cientos de consultores independientes (partners) en todo el mundo (por ejemplo, en Singapur, LATAM, etc.).

## El Problema Operativo
La escala masiva con un equipo tan pequeño genera un cuello de botella crítico: las dudas, solicitudes de demos, soporte y comisiones de los partners pueden saturar al equipo interno de Nexor, impidiendo que se enfoquen en el producto core.

## La Solución: Panel de Autoatención (Este Repositorio)
Este panel sirve como "escudo" para que los consultores independientes sean **100% autónomos**. Sus objetivos de producto y negocio son:
1. **Librería de recursos**: Para que aprendan a vender la tecnología de Nexor sin preguntar al equipo interno.
2. **Generador de demos y credenciales**: Para que puedan mostrar el producto a clientes potenciales de forma autónoma.
3. **Generador de links de pago**: Para acelerar el cierre comercial directamente desde la plataforma.
4. **Panel de comisiones**: Para dar transparencia total sobre sus ganancias.
5. **Sistema para levantar tickets de soporte**: Centralizado y estructurado.
6. **Integración de componentes agénticos**: Un simulador de chat interactivo que imita cómo los agentes autónomos de IA de Nexor interactúan con los leads de sus clientes a través de canales como WhatsApp.

## In Scope
- Desarrollo frontend y diseño de la interfaz web.
- Autonomía de producto y justificación del pensamiento crítico detrás de cada elemento.
- Simulación interactiva realista.

## Out of Scope
- Desarrollo backend real (no se evalúa base de datos ni lógica de servidor compleja).
- Programar la tecnología core de agentes de voz/chat de Nexor.

---

# Datos Verificados de Nexor
*(Fuentes: Diario Financiero, getnexor.ai, prensa de ecosistema, julio 2026. Hechos confirmados).*

## Empresa
- **Nombre legal**: Nexor AI, Inc.
- **Sitio**: [getnexor.ai](https://getnexor.ai) (opera en español e inglés).
- **Fundada**: 2026 (salió a producción la tercera semana de abril de 2026).
- **Origen**: Chile. Traslado de founders a San Francisco a fines de julio de 2026.
- **Nombre**: Sugerido por ChatGPT.

## Fundadores
- **Ian Lee (CEO / cofundador)**:
  - Ex fundador de Examedi (plataforma de exámenes médicos a domicilio, Chile y México) fundada a los 18 años.
  - Levantó USD 17M liderados por General Catalyst; otros inversores: 8VC, Quiet Capital, Goodwater Capital.
  - Único chileno en la Thiel Fellowship.
  - Salió de Examedi ~1.5 años antes de Nexor.
  - También asociado a un proyecto llamado Dropout, del cual delegó todo el 1 de enero de 2026 para dedicarse a Nexor.
  - Presbiteriano.
  - Diagnosticado de hipertensión a los 21 años.
- **Gabriel Cid (cofundador)**:
  - Venía financiando a un programador para un MVP antes de sumar a Lee. Perfil de corte comercial / capital.

## Capital
- **a16z Speedrun**: Batch 7 (arranca a fines de julio de 2026 en San Francisco). Primera startup chilena en ingresar al programa.
- **Deal**: USD 1M total = USD 500K por 10% + SAFE de USD 500K con valorización en blanco.
- **Rondas previas**: A USD 20M de valorización.
- **Platanus**: El VC chileno pasó del deal.

## Tracción
- **ARR**: USD 340K a ~6 meses de operación (dato de mayo de 2026, probablemente desactualizado).
- **Equipo**: 6 personas (mayo 2026).
- **Primer cliente piloto**: Empresa corporativa grande y conocida en LATAM (no nombrada públicamente).
- **Caso público**: Mudango (startup chilena de mudanzas).

## Producto
- Equipo de agentes de IA autónomos que contactan leads en menos de 60 segundos, califican, agendan reuniones y realizan venta directa.
- **Canales**: Llamada telefónica, WhatsApp, email, Instagram (coordinados).
- **Voz**: Chilena de registro alto, con ruido de oficina de fondo para maximizar el realismo.
- **Claim del CEO**: Hay personas que no saben que están hablando con una IA.
- **Integración**: Se integra al stack existente del cliente sin reemplazar sus herramientas core.
- **Funnel comercial**: Pitch de descubrimiento a través de una demo de 45 minutos mostrando "tu funnel con Nexor".

## Competidor Principal Declarado: Vambe
- Chilena, fundada en 2024. Nicolás Camhi (CEO), Diego Chahuan (CTO), Matías Pérez (CAIO/CPO).
- **Capital**: Serie A de USD 14M liderada por Monashees (Cathay Latam, Atlantico, Tekton, Chile Ventures, SkyDeck Berkeley, Nazca, M13). USD 18M+ acumulados.
- **Board**: Simón Borrero (Rappi).
- **Tracción**: Entre 1.700 y 2.000 implementaciones. 17% de crecimiento mensual. USD 6M revenue en 2025. Meta de USD 24M ARR a diciembre 2026.
- **Equipo**: De 22 a 80 personas (contrataron 70 personas en 70 días).
- **Mercados**: Operan en Chile, México y Colombia. Apertura en Brasil en 2026. ~30% de sus clientes están en México.
- **Enfoque**: B2C, PyME, WhatsApp-first, comercio conversacional.
- **Casos públicos**: Reuse, Global66, retail, automotriz, servicios financieros.
- **Posicionamiento de Nexor contra Vambe (Ian Lee)**: *"Mis tickets son seis veces más altos, tengo un excliente de Vambe que me paga seis veces más"*. Nexor apunta a otro mercado y cuenta con más funcionalidades avanzadas.

---

# Modelo Comercial y Estrategia de Pricing de Nexor (Verificados)
*(Estrategia oficial para el Portal de Socios / Embajadores. Resuelve los vacíos de información comercial).*

## 1. Esquema de Tarifas para Clientes Finales
Nexor opera bajo una estrategia comercial multi-segmento que permite al socio cerrar desde PyMEs tradicionales hasta corporaciones multinacionales:

### A. Modelo Prepago (Diseñado para PyMEs)
* **Público Objetivo**: Empresas medianas con presupuestos acotados, baja digitalización o desconfianza en cobros automatizados con tarjeta de crédito.
* **Tarifa**: **$15.00 USD por Lead Calificado (MQL)**.
* **Mecánica**: El cliente compra paquetes de saldo prepago de manera voluntaria (ej. 10 leads por $150 USD o 100 leads por $1,500 USD). El bot de IA gestiona los contactos y solo consume saldo cuando el prospecto pasa los filtros de calificación definidos en el CRM (se descarta spam y leads sin perfil de compra).
* **Cierre**: El embajador comercial genera un enlace de pago único y el cliente realiza la recarga manualmente.

### B. Modelo Suscripción Corporativa (Diseñado para Enterprise)
* **Público Objetivo**: Grandes empresas con procesos formales de facturación, contratos a largo plazo y altos volúmenes de leads.
* **Tarifa**: Planes fijos de Suscripción Mensual Recurrente (MRR):
  * **Plan Starter**: $299 USD/mes (Incluye 1 canal de atención y hasta 200 MQLs).
  * **Plan Growth**: $599 USD/mes (Incluye hasta 3 canales integrados y hasta 500 MQLs).
  * **Plan Custom Enterprise**: A partir de $1,500 USD/mes para volúmenes masivos.
  * *Excedentes*: $1.50 USD por MQL adicional.
* **Cierre**: Contrato de débito automático mensual en tarjeta corporativa.

---

## 2. Programa de Comisiones del Socio (Partner Program)
Los socios comerciales de Nexor (Embajadores) comisionan según su nivel de volumen activo (Tiers) sobre los montos reales cobrados al cliente (MRR o Recargas Prepago):

* **Tier 1: Explorer Partner** (Al unirse al programa): **15% de comisión recurrente** sobre los pagos del cliente.
* **Tier 2: Growth Partner** (A partir de 5 cuentas activas): **20% de comisión recurrente** sobre los pagos del cliente.
* **Tier 3: Elite Partner** (Más de 10 cuentas activas): **25% de comisión recurrente** sobre los pagos del cliente.

---

# Vacíos Críticos de Información
*(Nivel de confianza: Sin definición oficial / Desconocido)*

1. **Ciclo de Venta y Funnel Comercial Actual**: Proceso exacto de conversión interno.
2. **Proceso, Plazo y Equipo de Implementación**: Tiempos de puesta en marcha del agente para un cliente.
3. **Estrategia de Upsell y Cross-sell**: Métodos de expansión de cuentas.
4. **Composición Completa del Equipo y Organigrama**: Estructura de roles corporativos.
5. **ARR Actual (Julio 2026)**: Crecimiento tras el ingreso a a16z Speedrun.
6. **Churn, NRR y Márgenes Brutos**: Eficiencia operativa y retención.
7. **Estrategia Declarada para Centroamérica y Colombia**: Plan específico de expansión.

