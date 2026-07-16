"use client";

import React from "react";

export default function TerminosPage() {
  return (
    <div className="p-8 max-w-[720px] mx-auto space-y-6 text-[#3F3F46] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h1 className="text-2xl font-bold text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Términos y Condiciones de Uso
      </h1>
      <p className="text-[#71717A] text-xs">Última actualización: Julio 2026</p>

      <div className="space-y-5">
        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el Portal de Partners de Nexor (&ldquo;la Plataforma&rdquo;), usted acepta cumplir con estos Términos y Condiciones. Si no está de acuerdo, no utilice la Plataforma. Nexor AI, Inc. se reserva el derecho de modificar estos términos en cualquier momento, notificando los cambios a través de la Plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">2. Descripción del Servicio</h2>
          <p>
            Nexor es un ecosistema de automatización inteligente que permite a empresas calificar, atender y convertir leads a través de agentes de IA autónomos. La Plataforma ofrece a los partners (embajadores) herramientas para gestionar su cartera de clientes, simular ventas, calcular ROI, acceder a recursos de entrenamiento y dar seguimiento a sus comisiones.
          </p>
          <p className="mt-2">
            Los agentes de IA de Nexor operan a través de múltiples canales: llamada telefónica, WhatsApp, email, Instagram, Facebook y SMS. La tecnología se integra con CRMs como HubSpot, Salesforce, Pipedrive y Zoho sin reemplazar las herramientas existentes del cliente.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">3. Programa de Partners</h2>
          <p>
            Los partners de Nexor comisionan según su nivel de volumen activo sobre los montos reales cobrados al cliente:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Explorer Partner</strong> (al unirse): 15% de comisión recurrente.</li>
            <li><strong>Growth Partner</strong> (5+ cuentas activas): 20% de comisión recurrente.</li>
            <li><strong>Elite Partner</strong> (10+ cuentas activas): 25% de comisión recurrente.</li>
          </ul>
          <p className="mt-2">
            Las comisiones se calculan sobre los pagos mensuales de suscripción (MRR) o recargas prepago que realicen los clientes referidos por el partner. Los pagos se efectúan el día 10 de cada mes mediante transferencia directa.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">4. Obligaciones del Partner</h2>
          <p>Al utilizar la Plataforma como partner, usted se compromete a:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Proporcionar información veraz y actualizada sobre su identidad y datos de contacto.</li>
            <li>No realizar prácticas engañosas o fraudulentas en la promoción de los servicios de Nexor.</li>
            <li>Respetar la propiedad intelectual de Nexor, incluyendo marcas, logotipos y materiales de venta.</li>
            <li>Utilizar la Plataforma exclusivamente para los fines comerciales previstos.</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">5. Privacidad y Datos</h2>
          <p>
            Nexor recopila y procesa datos personales de acuerdo con su Política de Privacidad. Al utilizar la Plataforma, usted consiente el tratamiento de sus datos para la operación del servicio. Los datos de los leads gestionados por los agentes de IA se almacenan de forma segura y no se comparten con terceros sin autorización.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">6. Limitación de Responsabilidad</h2>
          <p>
            Nexor no garantiza resultados comerciales específicos. Las proyecciones de la Calculadora de ROI y el Simulador de Ventas son estimaciones basadas en datos históricos y no constituyen promesas de rendimiento. La Plataforma se proporciona &ldquo;tal cual&rdquo;, sin garantías de disponibilidad ininterrumpida.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">7. Propiedad Intelectual</h2>
          <p>
            Todos los derechos de propiedad intelectual sobre la Plataforma, incluyendo el código fuente, diseños, algoritmos de IA, marcas y materiales de entrenamiento, pertenecen a Nexor AI, Inc. El partner recibe una licencia limitada, no exclusiva e intransferible para usar la Plataforma conforme a estos términos.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">8. Terminación</h2>
          <p>
            Nexor se reserva el derecho de suspender o terminar el acceso de cualquier partner que incumpla estos términos, sin previo aviso. El partner puede dejar de usar la Plataforma en cualquier momento. Las comisiones devengadas antes de la terminación serán pagadas en el siguiente ciclo de facturación.
          </p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-[#111113] mb-2">9. Contacto</h2>
          <p>
            Para cualquier duda sobre estos términos, comuníquese con el equipo de Nexor a través de la sección de Soporte en la Plataforma o escriba a <a href="mailto:legal@getnexor.ai" className="text-[#111113] underline">legal@getnexor.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
