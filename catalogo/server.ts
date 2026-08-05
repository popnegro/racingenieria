import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with custom telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Sales Pitch Generator API Route
  app.post("/api/sales/pitch", async (req, res) => {
    try {
      const { equipment, clientInfo, lastLog, salesStyle } = req.body;

      if (!equipment) {
        return res.status(400).json({ error: "Falta información del equipo." });
      }

      const { name, manufacturer, model, specs } = equipment;
      const clientName = clientInfo?.name || "Cliente Industrial";
      const clientSector = clientInfo?.sector || "Industrial General";
      const clientContact = clientInfo?.contact || "Director de Mantenimiento / Operaciones";
      const clientPainPoint = clientInfo?.painPoint || "Reducir paradas imprevistas de planta";
      const clientObjective = clientInfo?.objective || "Contrato de mantenimiento preventivo anual";
      const clientUrgency = clientInfo?.urgency || "Alta";
      const clientBudget = clientInfo?.budget || "Por definir / Flexibilidad según criticidad";

      const lastLogInfo = lastLog
        ? `Fecha: ${lastLog.date}\nTipo de intervención: ${lastLog.type}\nTécnico: ${lastLog.technician}\nDescripción: ${lastLog.description}\nResultado: ${lastLog.outcome}\nDuración: ${lastLog.duration}`
        : "No hay registros de intervenciones recientes registradas.";

      let styleInstruction = "";
      if (salesStyle === "urgency") {
        styleInstruction = "Enfoque de Urgencia y Mitigación de Riesgo: Enfatiza los altos costos del tiempo de inactividad de la planta, los riesgos de una falla imprevista de este componente crítico y la tranquilidad de tener cobertura inmediata o repuestos críticos en sitio.";
      } else if (salesStyle === "value") {
        styleInstruction = "Enfoque de Retorno de Inversión y Valor: Concéntrate en la eficiencia energética, prolongación de la vida útil del activo, optimización del rendimiento térmico/eléctrico y la mejora de los KPI operativos globales.";
      } else {
        styleInstruction = "Enfoque Técnico Consultivo: Actúa como un asesor experto de confianza. Explica el desgaste físico/eléctrico en términos de ingeniería (ej. armónicos, temperatura, ciclos de conmutación), fundamentando cada recomendación de servicio o repuesto con argumentos de mantenimiento predictivo.";
      }

      const prompt = `
Actúa como un Ingeniero de Ventas Industriales Senior altamente experimentado. Tu misión es diseñar una estrategia de prospección comercial de precisión y un guión de venta adaptado ("sales speech") para este cliente en base a su última intervención técnica.

DATOS DEL CLIENTE:
- Empresa: ${clientName}
- Sector Industrial: ${clientSector}
- Contacto de Decisión y Cargo: ${clientContact}
- Desafío / Dolor Principal: ${clientPainPoint}
- Objetivo Comercial Buscado: ${clientObjective}
- Nivel de Urgencia Comercial: ${clientUrgency}
- Presupuesto Estimado: ${clientBudget}

DATOS DEL EQUIPO INDUSTRIAL:
- Nombre del Equipo: ${name}
- Fabricante: ${manufacturer}
- Modelo/Referencia: ${model}
- Especificaciones Técnicas Clave: ${JSON.stringify(specs)}

ÚLTIMO SERVICIO DE REPARACIÓN / MANTENIMIENTO (TRIGGER COMERCIAL):
${lastLogInfo}

ESTILO Y TONO DE VENTA SOLICITADO:
${styleInstruction}

Instrucciones de formato:
Debes generar una respuesta estructurada en Markdown que contenga las siguientes secciones redactadas en un español profesional, elegante y persuasivo:

1. **Estrategia Comercial (El "Gancho")**:
Explica al vendedor cómo abordar la llamada/reunión. ¿Por qué este momento (tras el último servicio) es el ideal? ¿Cuál es el "trigger" comercial y cómo usarlo sin sonar intrusivo? Justifica en base a la urgencia (${clientUrgency}) y el presupuesto (${clientBudget}).

2. **Guion / Speech de Venta**:
Genera tres plantillas de comunicación realistas y listas para usar:
  - **Speech de Llamada Telefónica / Reunión Express** (breve, de un minuto, buscando agendar visita técnica o videollamada de propuesta).
  - **Mensaje de Correo Electrónico Consultivo** (con un asunto atractivo, cuerpo profesional que aluda a la última intervención y una clara llamada a la acción).
  - **Mensaje de WhatsApp Profesional de Seguimiento** (corto, dinámico, amigable y directo).

3. **Propuesta de Servicios de Valor Añadido**:
Propón una terna de servicios específicos relacionados con este equipo (ej. contratos preventivos personalizados, kits de repuestos originales críticos en sitio, auditorías de calidad de energía/termografía). Justifica cada propuesta en base a la especificación técnica del equipo, lo detectado en el último servicio, y alineado con el objetivo de '${clientObjective}'.

Sé extremadamente detallado, realista y evita generalidades de venta vacías. Utiliza jerga industrial y técnica apropiada (ej. VFDs, contactores, transistores IGBT, armónicos, curvas de disparo, aislamiento, etc.).
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ pitch: response.text });
    } catch (error: any) {
      console.error("Error generating sales pitch via Gemini API:", error);
      res.status(500).json({ error: "Error interno al generar el pitch con el Agente IA." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
