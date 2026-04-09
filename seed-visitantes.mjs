/**
 * Seed: Encuesta de Visitantes v5 (definitiva)
 * Basada en "Encuestaturistas_v5.docx"
 * Ejecutar: node seed-visitantes.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ── Borrar plantilla anterior de visitantes ──────────────────────────────────
const [templates] = await conn.execute(
  "SELECT id FROM survey_templates WHERE type = 'visitantes'"
);
for (const t of templates) {
  await conn.execute("DELETE FROM questions WHERE templateId = ?", [t.id]);
  await conn.execute("DELETE FROM survey_templates WHERE id = ?", [t.id]);
}

// ── Crear plantilla ──────────────────────────────────────────────────────────
const [result] = await conn.execute(
  `INSERT INTO survey_templates (name, nameEn, type, description, targetCount, isActive)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    "Encuesta de Visitantes",
    "Visitor Survey",
    "visitantes",
    "Opinión de los visitantes sobre los efectos del turismo. Barrio de Santa Cruz, Sevilla 2026. N=450.",
    450,
    1,
  ]
);
const templateId = result.insertId;
console.log("Template ID:", templateId);

// ── Preguntas ────────────────────────────────────────────────────────────────
const questions = [
  // ── METADATOS ──────────────────────────────────────────────────────────────
  {
    order: 1,
    type: "single_choice",
    text: "META: Punto de encuesta",
    textEn: "META: Survey point",
    options: JSON.stringify([
      { value: "01", label: "01 Virgen de los Reyes" },
      { value: "02", label: "02 Mateos Gago" },
      { value: "03", label: "03 Patio de Banderas" },
      { value: "04", label: "04 Agua/Vida" },
      { value: "05", label: "05 Plaza Alfaro" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 2,
    type: "single_choice",
    text: "META: Bloque horario (150 min)",
    textEn: "META: Time block (150 min)",
    options: JSON.stringify([
      { value: "manana", label: "Mañana (9:30–12:00)" },
      { value: "mediodia", label: "Mediodía (12:00–14:30)" },
      { value: "tarde", label: "Tarde (16:00–18:30)" },
      { value: "noche", label: "Noche (18:30–21:00)" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 3,
    type: "single_choice",
    text: "META: Ventana (tramo 30 min)",
    textEn: "META: Window (30-min slot)",
    options: JSON.stringify([
      { value: "V1", label: "V1 (0–30 min)" },
      { value: "V2", label: "V2 (30–60 min)" },
      { value: "V3", label: "V3 (60–90 min)" },
      { value: "V4", label: "V4 (90–120 min)" },
      { value: "V5", label: "V5 (120–150 min)" },
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
    type: "single_choice",
    text: "P1. ¿Cuál es su país de residencia?",
    textEn: "P1. What is your country of residence?",
    options: JSON.stringify([
      { value: "espana", label: "España" },
      { value: "otro", label: "Otro (especificar ciudad)" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 8,
    type: "text",
    text: "P1b. Si España → ¿Provincia/Ciudad?",
    textEn: "P1b. If Spain → Province/City?",
    options: null,
    isRequired: false,
    requiresPhoto: false,
  },
  {
    order: 9,
    type: "single_choice",
    text: "P2. ¿Es la primera vez que visita Sevilla?",
    textEn: "P2. Is this your first visit to Seville?",
    options: JSON.stringify([
      { value: "primera_vez", label: "Sí (primera vez)" },
      { value: "2_3_veces", label: "2–3 veces" },
      { value: "4_10_veces", label: "4–10 veces" },
      { value: "mas_10", label: "Más de 10 veces" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 10,
    type: "single_choice",
    text: "P3. ¿Cuántos días va a permanecer o está permaneciendo en la ciudad en este viaje?",
    textEn: "P3. How many days are you staying in the city on this trip?",
    options: JSON.stringify([
      { value: "solo_hoy", label: "Solo hoy" },
      { value: "1_noche", label: "1 noche" },
      { value: "2_3_noches", label: "2–3 noches" },
      { value: "4_7_noches", label: "4–7 noches" },
      { value: "mas_semana", label: "Más de una semana" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 11,
    type: "single_choice",
    text: "P4. ¿Cuál es su rango de edad?",
    textEn: "P4. What is your age range?",
    options: JSON.stringify([
      { value: "18_29", label: "18–29" },
      { value: "30_44", label: "30–44" },
      { value: "45_64", label: "45–64" },
      { value: "65_75", label: "65–75" },
      { value: "76_mas", label: "76 o más" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 12,
    type: "single_choice",
    text: "P4b. Género",
    textEn: "P4b. Gender",
    options: JSON.stringify([
      { value: "mujer", label: "Mujer" },
      { value: "hombre", label: "Hombre" },
      { value: "otro", label: "Otro / prefiero no decirlo" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── SECCIÓN 2: Motivación y características del viaje ───────────────────────
  {
    order: 13,
    type: "single_choice",
    text: "P5. ¿Cuál es el motivo principal de su visita a Sevilla?",
    textEn: "P5. What is the main reason for your visit to Seville?",
    options: JSON.stringify([
      { value: "turismo_cultural", label: "Turismo cultural / patrimonio" },
      { value: "ocio", label: "Ocio general" },
      { value: "gastronomia", label: "Gastronomía" },
      { value: "familia_amigos", label: "Visita a familiares/amigos" },
      { value: "trabajo", label: "Trabajo / negocios" },
      { value: "eventos", label: "Eventos (cultura, congreso, deporte…)" },
      { value: "otro", label: "Otro" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 14,
    type: "single_choice",
    text: "P6. ¿Con quién viaja?",
    textEn: "P6. Who are you travelling with?",
    options: JSON.stringify([
      { value: "solo", label: "Solo/a" },
      { value: "pareja", label: "En pareja" },
      { value: "familia", label: "Con familia" },
      { value: "amigos", label: "Con amigos" },
      { value: "grupo_organizado", label: "Grupo organizado" },
      { value: "otro", label: "Otro" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 15,
    type: "number",
    text: "P6b. ¿Cuántas personas en su grupo?",
    textEn: "P6b. How many people in your group?",
    options: null,
    isRequired: false,
    requiresPhoto: false,
  },

  // ── SECCIÓN 3: Movilidad y experiencia en el punto ──────────────────────────
  {
    order: 16,
    type: "single_choice",
    text: "P7. ¿Cómo ha llegado al punto donde se encuentra ahora?",
    textEn: "P7. How did you get to the point where you are now?",
    options: JSON.stringify([
      { value: "caminando", label: "Caminando" },
      { value: "bicicleta_patinete", label: "Bicicleta / patinete" },
      { value: "autobus_tranvia", label: "Autobús / tranvía / metro" },
      { value: "taxi_vtc", label: "Taxi / VTC" },
      { value: "vehiculo_propio", label: "Vehículo propio" },
      { value: "tour_organizado", label: "Tour organizado" },
      { value: "otro", label: "Otro" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 17,
    type: "single_choice",
    text: "P8. ¿Qué le ha llevado a pasar por este punto concreto?",
    textEn: "P8. What brought you to this specific point?",
    options: JSON.stringify([
      { value: "recorrido_planificado", label: "Recorrido turístico planificado" },
      { value: "camino_otro_lugar", label: "Camino hacia otro lugar" },
      { value: "visita_monumento", label: "Visita a un monumento" },
      { value: "recomendacion", label: "Recomendación / guía" },
      { value: "paseando", label: "Simplemente paseando" },
      { value: "otro", label: "Otro" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 18,
    type: "single_choice",
    text: "P9. ¿Ha modificado su recorrido o planes hoy por la cantidad de gente en algún lugar?",
    textEn: "P9. Have you changed your route or plans today due to the number of people somewhere?",
    options: JSON.stringify([
      { value: "evite_lugar", label: "Sí, evité algún lugar" },
      { value: "acorte_visita", label: "Sí, acorté la visita a algún punto" },
      { value: "cambie_horario", label: "Sí, cambié el horario" },
      { value: "no", label: "No, seguí el plan original" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── SECCIÓN 4: Percepción de afluencia y comodidad ──────────────────────────
  {
    order: 19,
    type: "scale",
    text: "P11. ¿Cómo describiría ahora mismo la cantidad de gente en este lugar? (1=Muy baja, 5=Muy alta)",
    textEn: "P11. How would you describe the number of people here right now? (1=Very low, 5=Very high)",
    options: JSON.stringify([
      { value: "1", label: "1 – Muy baja" },
      { value: "2", label: "2 – Baja" },
      { value: "3", label: "3 – Moderada" },
      { value: "4", label: "4 – Alta" },
      { value: "5", label: "5 – Muy alta" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 20,
    type: "scale",
    text: "P12. ¿La presencia de gente afecta a su experiencia en este punto? (1=Nada, 5=Muchísimo)",
    textEn: "P12. Does the number of people affect your experience here? (1=Not at all, 5=A lot)",
    options: JSON.stringify([
      { value: "1", label: "1 – Nada" },
      { value: "2", label: "2 – Poco" },
      { value: "3", label: "3 – Algo" },
      { value: "4", label: "4 – Mucho" },
      { value: "5", label: "5 – Muchísimo" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 21,
    type: "single_choice",
    text: "P13. ¿Este nivel de afluencia le resulta…?",
    textEn: "P13. This level of crowding feels…?",
    options: JSON.stringify([
      { value: "muy_agradable", label: "Muy agradable" },
      { value: "agradable", label: "Agradable" },
      { value: "aceptable", label: "Aceptable" },
      { value: "molesto", label: "Molesto" },
      { value: "muy_molesto", label: "Muy molesto" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 22,
    type: "scale",
    text: "P14. ¿Le parece que este espacio está bien adaptado para la cantidad de visitantes que recibe? (1=Muy mal adaptado, 5=Muy bien adaptado)",
    textEn: "P14. Is this space well adapted for the number of visitors it receives? (1=Very poorly, 5=Very well)",
    options: JSON.stringify([
      { value: "1", label: "1 – Muy mal adaptado" },
      { value: "2", label: "2 – Mal adaptado" },
      { value: "3", label: "3 – Regular" },
      { value: "4", label: "4 – Bien adaptado" },
      { value: "5", label: "5 – Muy bien adaptado" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── SECCIÓN 5: Usos y sensaciones en el espacio público ─────────────────────
  {
    order: 23,
    type: "single_choice",
    text: "P15. ¿Para qué está usando principalmente este espacio en este momento?",
    textEn: "P15. What are you mainly using this space for right now?",
    options: JSON.stringify([
      { value: "contemplar", label: "Contemplar / observar" },
      { value: "fotografiar", label: "Fotografiar / filmar" },
      { value: "descansar", label: "Descansar" },
      { value: "transitar", label: "Transitar (paso hacia otro lugar)" },
      { value: "comer_beber", label: "Comer o beber" },
      { value: "socializar", label: "Socializar" },
      { value: "guia", label: "Escuchar una explicación (guía)" },
      { value: "otro", label: "Otro" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 24,
    type: "text",
    text: "P16. ¿Qué le está gustando más en este lugar? (breve)",
    textEn: "P16. What do you like most about this place? (brief)",
    options: null,
    isRequired: false,
    requiresPhoto: false,
  },
  {
    order: 25,
    type: "text",
    text: "P17. ¿Qué le está incomodando o molestando? (breve)",
    textEn: "P17. What is bothering or inconveniencing you? (brief)",
    options: null,
    isRequired: false,
    requiresPhoto: false,
  },

  // ── SECCIÓN 6: Cierre ────────────────────────────────────────────────────────
  {
    order: 26,
    type: "scale",
    text: "P18. ¿Recomendaría visitar este punto concreto a otros viajeros? (1=No lo recomendaría, 5=Lo recomendaría sin duda)",
    textEn: "P18. Would you recommend visiting this specific point to other travellers? (1=Would not recommend, 5=Would definitely recommend)",
    options: JSON.stringify([
      { value: "1", label: "1 – No lo recomendaría" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5 – Lo recomendaría sin duda" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
];

for (const q of questions) {
  await conn.execute(
    `INSERT INTO questions (templateId, \`order\`, type, text, textEn, options, isRequired, requiresPhoto)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      templateId,
      q.order,
      q.type,
      q.text,
      q.textEn || null,
      q.options || null,
      q.isRequired ? 1 : 0,
      q.requiresPhoto ? 1 : 0,
    ]
  );
}

console.log(`✅ Encuesta visitantes v5: ${questions.length} preguntas insertadas. Template ID: ${templateId}`);
await conn.end();
