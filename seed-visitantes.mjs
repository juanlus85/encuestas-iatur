/**
 * Seed script: Plantilla "Encuesta a Visitantes" - IATUR / Barrio de Santa Cruz
 * Cuestionario completo: Metadatos de campo + P1 – P15
 * N=400: 40 no sevillanos, 180 nacionales, 180 extranjeros (formulario en inglés para extranjeros)
 * Ejecutar: node seed-visitantes.mjs
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// ─── 1. Plantilla ─────────────────────────────────────────────────────────────

const [templateResult] = await connection.execute(`
  INSERT INTO survey_templates (name, nameEn, type, description, descriptionEn, isActive, targetCount)
  VALUES (
    'Encuesta a Visitantes - Barrio de Santa Cruz',
    'Visitors Survey - Santa Cruz Quarter',
    'visitantes',
    'Estudio de opinión de los visitantes sobre los efectos del turismo. FASE 2. Muestreo sistemático (1 de cada 7 transeúntes adultos). 5 puntos: Mateos Gago, Agua/Vida, Plaza de Alfaro, Virgen de los Reyes, Patio de Banderas.',
    'Opinion study on the effects of tourism among visitors. PHASE 2. Systematic sampling (1 in every 7 adult passers-by). 5 survey points: Mateos Gago, Agua/Vida, Plaza de Alfaro, Virgen de los Reyes, Patio de Banderas.',
    1,
    400
  )
`);

const templateId = templateResult.insertId;
console.log(`✓ Plantilla visitantes creada con ID: ${templateId}`);

// ─── 2. Preguntas ─────────────────────────────────────────────────────────────

const questions = [

  // ── SECCIÓN 0: Metadatos de campo (capturados en pantalla previa) ───────────
  // Nota: punto, fecha, bloque horario y código de ventana se capturan como
  // metadatos estructurados en el formulario, no como preguntas de respuesta libre.
  // Se incluyen aquí como preguntas de tipo single_choice para registro explícito.

  {
    order: 1,
    type: "single_choice",
    text: "META: Punto de encuesta",
    textEn: "META: Survey point",
    options: JSON.stringify([
      { value: "mateos_gago", label: "Mateos Gago", labelEn: "Mateos Gago" },
      { value: "agua_vida", label: "Agua/Vida", labelEn: "Agua/Vida" },
      { value: "plaza_alfaro", label: "Plaza de Alfaro", labelEn: "Plaza de Alfaro" },
      { value: "virgen_reyes", label: "Virgen de los Reyes", labelEn: "Virgen de los Reyes" },
      { value: "patio_banderas", label: "Patio de Banderas", labelEn: "Patio de Banderas" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 2,
    type: "single_choice",
    text: "META: Bloque horario (90 min)",
    textEn: "META: Time block (90 min)",
    options: JSON.stringify([
      { value: "manana", label: "Mañana (10–12)", labelEn: "Morning (10–12)" },
      { value: "mediodia", label: "Mediodía (12–15)", labelEn: "Midday (12–15)" },
      { value: "tarde", label: "Tarde (17–20)", labelEn: "Afternoon (17–20)" },
      { value: "noche", label: "Noche (20–23)", labelEn: "Evening (20–23)" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 3,
    type: "single_choice",
    text: "META: Código de ventana (tramo 30 min)",
    textEn: "META: Window code (30-min slot)",
    options: JSON.stringify([
      { value: "V1", label: "V1 (min 0–30)", labelEn: "V1 (min 0–30)" },
      { value: "V2", label: "V2 (min 30–60)", labelEn: "V2 (min 30–60)" },
      { value: "V3", label: "V3 (min 60–90)", labelEn: "V3 (min 60–90)" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 4,
    type: "number",
    text: "META: Minuto de inicio de la entrevista",
    textEn: "META: Interview start minute",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 5,
    type: "number",
    text: "META: Minuto de fin de la entrevista",
    textEn: "META: Interview end minute",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 6,
    type: "text",
    text: "META: Código de cuestionario",
    textEn: "META: Questionnaire code",
    options: null,
    isRequired: false,
    requiresPhoto: false,
  },

  // ── SECCIÓN 1: Perfil del visitante ─────────────────────────────────────────

  {
    order: 7,
    type: "text",
    text: "P1. ¿Cuál es su municipio de residencia?",
    textEn: "P1. What is your municipality of residence?",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 8,
    type: "single_choice",
    text: "P2. ¿Es la primera vez que visita Sevilla?",
    textEn: "P2. Is this your first visit to Seville?",
    options: JSON.stringify([
      { value: "si", label: "Sí", labelEn: "Yes" },
      { value: "no", label: "No", labelEn: "No" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 9,
    type: "single_choice",
    text: "P3. ¿Cuántos días va a permanecer o ha permanecido en la ciudad en este viaje?",
    textEn: "P3. How many days are you staying or have you stayed in the city on this trip?",
    options: JSON.stringify([
      { value: "solo_hoy", label: "Solo el día de hoy", labelEn: "Just today" },
      { value: "1_noche", label: "1 noche", labelEn: "1 night" },
      { value: "2_3_noches", label: "2–3 noches", labelEn: "2–3 nights" },
      { value: "4_7_noches", label: "4–7 noches", labelEn: "4–7 nights" },
      { value: "mas_semana", label: "Más de una semana", labelEn: "More than a week" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 10,
    type: "text",
    text: "P4. ¿De dónde viene en este viaje? (ciudad / país de origen)",
    textEn: "P4. Where are you travelling from? (city / country of origin)",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },

  // ── SECCIÓN 2: Motivación y características del viaje ───────────────────────

  {
    order: 11,
    type: "single_choice",
    text: "P5. ¿Cuál es el motivo principal de su visita a Sevilla?",
    textEn: "P5. What is the main reason for your visit to Seville?",
    options: JSON.stringify([
      { value: "turismo_cultural", label: "Turismo cultural / patrimonio", labelEn: "Cultural tourism / heritage" },
      { value: "gastronomia", label: "Gastronomía", labelEn: "Gastronomy" },
      { value: "trabajo", label: "Trabajo / negocios", labelEn: "Work / business" },
      { value: "ocio", label: "Ocio general", labelEn: "General leisure" },
      { value: "familia_amigos", label: "Visita a familiares/amigos", labelEn: "Visiting family/friends" },
      { value: "eventos", label: "Eventos (cultura, congresos, deporte…)", labelEn: "Events (culture, conferences, sport…)" },
      { value: "otro", label: "Otro (especificar)", labelEn: "Other (specify)" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 12,
    type: "single_choice",
    text: "P6. ¿Viaja…?",
    textEn: "P6. Are you travelling…?",
    options: JSON.stringify([
      { value: "solo", label: "Solo/a", labelEn: "Alone" },
      { value: "familia", label: "Con familia", labelEn: "With family" },
      { value: "amigos", label: "Con amigos", labelEn: "With friends" },
      { value: "grupo_organizado", label: "En grupo organizado", labelEn: "In an organised group" },
      { value: "otro", label: "Otro", labelEn: "Other" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── SECCIÓN 3: Movilidad y experiencia en el punto ──────────────────────────

  {
    order: 13,
    type: "single_choice",
    text: "P7. ¿Cómo ha llegado al punto donde se encuentra ahora?",
    textEn: "P7. How did you get to the point where you are now?",
    options: JSON.stringify([
      { value: "caminando", label: "Caminando", labelEn: "Walking" },
      { value: "bicicleta", label: "Bicicleta / patinete", labelEn: "Bicycle / scooter" },
      { value: "autobus_tranvia", label: "Autobús / tranvía", labelEn: "Bus / tram" },
      { value: "taxi_vtc", label: "Taxi / VTC", labelEn: "Taxi / ride-hailing" },
      { value: "vehiculo_propio", label: "Vehículo propio", labelEn: "Own vehicle" },
      { value: "tour_organizado", label: "Tour organizado", labelEn: "Organised tour" },
      { value: "otro", label: "Otro", labelEn: "Other" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 14,
    type: "single_choice",
    text: "P8. ¿Qué le ha llevado a pasar por este punto concreto?",
    textEn: "P8. What brought you to this specific point?",
    options: JSON.stringify([
      { value: "recorrido_turistico", label: "Recorrido turístico", labelEn: "Tourist itinerary" },
      { value: "camino_otro_lugar", label: "Camino hacia otro lugar", labelEn: "On the way to another place" },
      { value: "visita_monumento", label: "Visita a un monumento", labelEn: "Visiting a monument" },
      { value: "recomendacion", label: "Recomendación / guía", labelEn: "Recommendation / guide" },
      { value: "paseando", label: "Simplemente paseando", labelEn: "Just strolling" },
      { value: "otro", label: "Otro", labelEn: "Other" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── SECCIÓN 4: Percepción de afluencia y comodidad ──────────────────────────

  {
    order: 15,
    type: "single_choice",
    text: "P9. ¿Cómo describiría ahora mismo la cantidad de gente en este lugar?",
    textEn: "P9. How would you describe the number of people in this place right now?",
    options: JSON.stringify([
      { value: "muy_alta", label: "Muy alta", labelEn: "Very high" },
      { value: "alta", label: "Alta", labelEn: "High" },
      { value: "moderada", label: "Moderada", labelEn: "Moderate" },
      { value: "baja", label: "Baja", labelEn: "Low" },
      { value: "muy_baja", label: "Muy baja", labelEn: "Very low" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 16,
    type: "single_choice",
    text: "P10. ¿La presencia de gente afecta a su experiencia en este punto?",
    textEn: "P10. Does the number of people affect your experience at this point?",
    options: JSON.stringify([
      { value: "mucho", label: "Mucho", labelEn: "A lot" },
      { value: "algo", label: "Algo", labelEn: "Somewhat" },
      { value: "poco", label: "Poco", labelEn: "A little" },
      { value: "nada", label: "Nada", labelEn: "Not at all" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 17,
    type: "single_choice",
    text: "P11. ¿Este nivel de afluencia le parece…?",
    textEn: "P11. This level of crowding seems to you…?",
    options: JSON.stringify([
      { value: "agradable", label: "Agradable", labelEn: "Pleasant" },
      { value: "aceptable", label: "Aceptable", labelEn: "Acceptable" },
      { value: "molesto", label: "Molesto", labelEn: "Annoying" },
      { value: "muy_molesto", label: "Muy molesto", labelEn: "Very annoying" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── SECCIÓN 5: Sensaciones y valoración inmediata ───────────────────────────

  {
    order: 18,
    type: "single_choice",
    text: "P12. ¿Cómo describiría su experiencia en este espacio en este momento?",
    textEn: "P12. How would you describe your experience in this space right now?",
    options: JSON.stringify([
      { value: "muy_positiva", label: "Muy positiva", labelEn: "Very positive" },
      { value: "positiva", label: "Positiva", labelEn: "Positive" },
      { value: "neutral", label: "Neutral", labelEn: "Neutral" },
      { value: "negativa", label: "Negativa", labelEn: "Negative" },
      { value: "muy_negativa", label: "Muy negativa", labelEn: "Very negative" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 19,
    type: "text",
    text: "P13. ¿Qué le está gustando más en este lugar? (Respuesta breve)",
    textEn: "P13. What are you enjoying most about this place? (Brief answer)",
    options: null,
    isRequired: false,
    requiresPhoto: false,
  },
  {
    order: 20,
    type: "text",
    text: "P14. ¿Y qué le está incomodando o molestando, si algo? (Respuesta breve)",
    textEn: "P14. And what, if anything, is bothering or annoying you? (Brief answer)",
    options: null,
    isRequired: false,
    requiresPhoto: false,
  },

  // ── SECCIÓN 6: Cierre ────────────────────────────────────────────────────────

  {
    order: 21,
    type: "single_choice",
    text: "P15. ¿Recomendaría visitar este punto a otros visitantes?",
    textEn: "P15. Would you recommend visiting this point to other visitors?",
    options: JSON.stringify([
      { value: "si", label: "Sí", labelEn: "Yes" },
      { value: "tal_vez", label: "Tal vez", labelEn: "Maybe" },
      { value: "no", label: "No", labelEn: "No" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
];

// ─── 3. Insertar preguntas ────────────────────────────────────────────────────

let inserted = 0;
for (const q of questions) {
  await connection.execute(
    `INSERT INTO questions (templateId, \`order\`, type, text, textEn, options, isRequired, requiresPhoto)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      templateId,
      q.order,
      q.type,
      q.text,
      q.textEn,
      q.options,
      q.isRequired ? 1 : 0,
      q.requiresPhoto ? 1 : 0,
    ]
  );
  inserted++;
  console.log(`  ✓ [${String(q.order).padStart(2, "0")}] ${q.text.substring(0, 65)}`);
}

console.log(`\n✅ Plantilla visitantes ID=${templateId} creada con ${inserted} preguntas.`);
await connection.end();
