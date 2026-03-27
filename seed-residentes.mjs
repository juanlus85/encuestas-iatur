/**
 * Seed script: Plantilla "Encuesta a Residentes" - IATUR / Barrio de Santa Cruz
 * Cuestionario completo P.01 – P.13
 * Ejecutar: node seed-residentes.mjs
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// ─── 1. Insertar plantilla ────────────────────────────────────────────────────

const [templateResult] = await connection.execute(`
  INSERT INTO survey_templates (name, nameEn, type, description, descriptionEn, isActive, targetCount)
  VALUES (
    'Encuesta a Residentes - Barrio de Santa Cruz',
    'Residents Survey - Santa Cruz Quarter',
    'residentes',
    'Estudio de opinión de los residentes sobre los efectos del turismo. FASE 2. Muestreo estratificado. Sección censal 37.',
    'Opinion study on the effects of tourism among residents. PHASE 2. Stratified sampling. Census section 37.',
    1,
    300
  )
`);

const templateId = templateResult.insertId;
console.log(`✓ Plantilla creada con ID: ${templateId}`);

// ─── 2. Preguntas ─────────────────────────────────────────────────────────────

const questions = [
  // ── Filtro y datos básicos ──────────────────────────────────────────────────
  {
    order: 1,
    type: "yes_no",
    text: "P.01 ¿Reside en la sección censal 37?",
    textEn: "P.01 Do you reside in census section 37?",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 2,
    type: "text",
    text: "P.02 ¿Y concretamente, cuál es su municipio de residencia?",
    textEn: "P.02 And specifically, what is your municipality of residence?",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 3,
    type: "number",
    text: "P.03 ¿Sería tan amable de indicarnos su edad?",
    textEn: "P.03 Could you please tell us your age?",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 4,
    type: "single_choice",
    text: "P.04 ¿Es usted hombre o mujer?",
    textEn: "P.04 Are you male or female?",
    options: JSON.stringify([
      { value: "hombre", label: "Hombre", labelEn: "Male" },
      { value: "mujer", label: "Mujer", labelEn: "Female" },
      { value: "otro", label: "Otro / Prefiero no decirlo", labelEn: "Other / Prefer not to say" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 5,
    type: "number",
    text: "P.01b ¿Cuántos años lleva residiendo en el municipio?",
    textEn: "P.01b How many years have you been living in the municipality?",
    options: null,
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 6,
    type: "yes_no",
    text: "P.02b ¿Vive en el centro histórico del municipio?",
    textEn: "P.02b Do you live in the historic centre of the municipality?",
    options: JSON.stringify([
      { value: "si", label: "Sí", labelEn: "Yes" },
      { value: "no", label: "No", labelEn: "No" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 7,
    type: "yes_no",
    text: "P.03b ¿Trabaja en el centro histórico del municipio?",
    textEn: "P.03b Do you work in the historic centre of the municipality?",
    options: JSON.stringify([
      { value: "si", label: "Sí", labelEn: "Yes" },
      { value: "no", label: "No", labelEn: "No" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 8,
    type: "single_choice",
    text: "P.04b ¿Alguna persona de su hogar trabaja o tiene vinculación económica con el sector turístico?",
    textEn: "P.04b Does anyone in your household work in or have an economic link to the tourism sector?",
    options: JSON.stringify([
      { value: "si_yo", label: "Sí, yo", labelEn: "Yes, me" },
      { value: "si_otra", label: "Sí, otra persona", labelEn: "Yes, someone else" },
      { value: "no", label: "No", labelEn: "No" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── P.5 y P.6 – Escalas de percepción ──────────────────────────────────────
  {
    order: 9,
    type: "scale",
    text: "P.5 ¿Cómo considera que le afecta personalmente el turismo? (1 = Muy negativamente, 5 = Muy positivamente, 99 = No sabe)",
    textEn: "P.5 How do you feel tourism personally affects you? (1 = Very negatively, 5 = Very positively, 99 = Don't know)",
    options: JSON.stringify([
      { value: "1", label: "1 - Muy negativamente", labelEn: "1 - Very negatively" },
      { value: "2", label: "2 - Negativamente", labelEn: "2 - Negatively" },
      { value: "3", label: "3 - Indiferente / No afecta", labelEn: "3 - Indifferent / No effect" },
      { value: "4", label: "4 - Positivamente", labelEn: "4 - Positively" },
      { value: "5", label: "5 - Muy positivamente", labelEn: "5 - Very positively" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 10,
    type: "scale",
    text: "P.6 ¿Cómo considera que afecta el turismo a su comunidad / municipio / lugar de residencia? (1 = Muy negativamente, 5 = Muy positivamente, 99 = No sabe)",
    textEn: "P.6 How do you feel tourism affects your community / municipality / place of residence? (1 = Very negatively, 5 = Very positively, 99 = Don't know)",
    options: JSON.stringify([
      { value: "1", label: "1 - Muy negativamente", labelEn: "1 - Very negatively" },
      { value: "2", label: "2 - Negativamente", labelEn: "2 - Negatively" },
      { value: "3", label: "3 - Indiferente / No afecta", labelEn: "3 - Indifferent / No effect" },
      { value: "4", label: "4 - Positivamente", labelEn: "4 - Positively" },
      { value: "5", label: "5 - Muy positivamente", labelEn: "5 - Very positively" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── P.7 – Batería de actitudes (15 ítems Likert 1-5 + 99) ──────────────────
  {
    order: 11,
    type: "scale",
    text: "P.7.01 El turismo mejora la economía local y aumenta las posibilidades de empleo. (1 = Totalmente en desacuerdo … 5 = Totalmente de acuerdo, 99 = No sabe)",
    textEn: "P.7.01 Tourism improves the local economy and increases employment opportunities. (1 = Strongly disagree … 5 = Strongly agree, 99 = Don't know)",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 12,
    type: "scale",
    text: "P.7.02 El turismo genera congestión en el espacio, infraestructuras o servicios públicos (transporte, sanidad, basura, etc.).",
    textEn: "P.7.02 Tourism creates congestion in public spaces, infrastructure or services (transport, health, waste, etc.).",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 13,
    type: "scale",
    text: "P.7.03 El turismo atrae nuevos inversores.",
    textEn: "P.7.03 Tourism attracts new investors.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 14,
    type: "scale",
    text: "P.7.04 El turismo encarece el precio de las viviendas (alquiler y venta).",
    textEn: "P.7.04 Tourism increases housing prices (rental and purchase).",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 15,
    type: "scale",
    text: "P.7.05 El turismo aumenta la calidad de vida de la población residente.",
    textEn: "P.7.05 Tourism improves the quality of life of the resident population.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 16,
    type: "scale",
    text: "P.7.06 El turismo está provocando desplazamientos de la población local a zonas alejadas del centro.",
    textEn: "P.7.06 Tourism is causing the displacement of local residents to areas away from the centre.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 17,
    type: "scale",
    text: "P.7.07 El turismo ayuda a mejorar el prestigio e imagen del municipio.",
    textEn: "P.7.07 Tourism helps improve the prestige and image of the municipality.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 18,
    type: "scale",
    text: "P.7.08 El turismo contribuye a la pérdida de identidad, cultura y tradiciones del municipio.",
    textEn: "P.7.08 Tourism contributes to the loss of identity, culture and traditions of the municipality.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 19,
    type: "scale",
    text: "P.7.09 El turismo ayuda a conservar y revalorizar los monumentos y espacios naturales (montes, playas, etc.).",
    textEn: "P.7.09 Tourism helps conserve and enhance monuments and natural spaces (mountains, beaches, etc.).",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 20,
    type: "scale",
    text: "P.7.10 El turismo trae consigo un aumento del tráfico en mi municipio y falta de aparcamiento.",
    textEn: "P.7.10 Tourism brings increased traffic to my municipality and a lack of parking.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 21,
    type: "scale",
    text: "P.7.11 El turismo incrementa las opciones de ocio.",
    textEn: "P.7.11 Tourism increases leisure options.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 22,
    type: "scale",
    text: "P.7.12 El turismo mejora servicios (como limpieza o seguridad) del municipio.",
    textEn: "P.7.12 Tourism improves services (such as cleanliness or security) in the municipality.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 23,
    type: "scale",
    text: "P.7.13 El turismo consume recursos (agua, energía, suelo, etc.) que condiciona el uso a la población residente.",
    textEn: "P.7.13 Tourism consumes resources (water, energy, land, etc.) that limits their use by the resident population.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 24,
    type: "scale",
    text: "P.7.14 El turismo aumenta los niveles de contaminación, en general (acústica, lumínica, etc.) y la suciedad.",
    textEn: "P.7.14 Tourism increases pollution levels in general (noise, light, etc.) and dirtiness.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 25,
    type: "scale",
    text: "P.7.15 El turismo contribuye a crear una sociedad más tolerante y multicultural.",
    textEn: "P.7.15 Tourism contributes to creating a more tolerant and multicultural society.",
    options: JSON.stringify([
      { value: "1", label: "1 - Totalmente en desacuerdo", labelEn: "1 - Strongly disagree" },
      { value: "2", label: "2", labelEn: "2" },
      { value: "3", label: "3", labelEn: "3" },
      { value: "4", label: "4", labelEn: "4" },
      { value: "5", label: "5 - Totalmente de acuerdo", labelEn: "5 - Strongly agree" },
      { value: "99", label: "99 - No sabe", labelEn: "99 - Don't know" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── P.10 – Convivencia y efectos vecinales ──────────────────────────────────
  {
    order: 26,
    type: "multiple_choice",
    text: "P.10 ¿Ha experimentado alguna de estas situaciones? (Múltiple respuesta)",
    textEn: "P.10 Have you experienced any of these situations? (Multiple choice)",
    options: JSON.stringify([
      { value: "dificultad_caminar", label: "Dificultad para caminar por saturación", labelEn: "Difficulty walking due to overcrowding" },
      { value: "inseguridad_vial", label: "Sensación de inseguridad vial", labelEn: "Feeling of road insecurity" },
      { value: "ruido", label: "Ruido o actividades molestas", labelEn: "Noise or disturbing activities" },
      { value: "cambios_rutas", label: "Cambios en sus rutas habituales", labelEn: "Changes to usual routes" },
      { value: "ninguna", label: "Ninguna de las anteriores", labelEn: "None of the above" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 27,
    type: "single_choice",
    text: "P.11 ¿La presencia turística ha cambiado su uso del espacio público?",
    textEn: "P.11 Has the tourist presence changed your use of public space?",
    options: JSON.stringify([
      { value: "mucho", label: "Mucho", labelEn: "A lot" },
      { value: "algo", label: "Algo", labelEn: "Somewhat" },
      { value: "poco", label: "Poco", labelEn: "A little" },
      { value: "nada", label: "Nada", labelEn: "Not at all" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },

  // ── P.12 y P.13 – Valoración global y propuestas ───────────────────────────
  {
    order: 28,
    type: "single_choice",
    text: "P.12 ¿Cómo calificaría su satisfacción con la convivencia entre residentes y turistas?",
    textEn: "P.12 How would you rate your satisfaction with the coexistence between residents and tourists?",
    options: JSON.stringify([
      { value: "muy_satisfecho", label: "Muy satisfecho/a", labelEn: "Very satisfied" },
      { value: "satisfecho", label: "Satisfecho/a", labelEn: "Satisfied" },
      { value: "neutral", label: "Neutral", labelEn: "Neutral" },
      { value: "insatisfecho", label: "Insatisfecho/a", labelEn: "Dissatisfied" },
      { value: "muy_insatisfecho", label: "Muy insatisfecho/a", labelEn: "Very dissatisfied" },
    ]),
    isRequired: true,
    requiresPhoto: false,
  },
  {
    order: 29,
    type: "multiple_choice",
    text: "P.13 ¿Qué medidas cree que deberían priorizarse para mejorar la movilidad y la convivencia? (Múltiple respuesta)",
    textEn: "P.13 What measures do you think should be prioritised to improve mobility and coexistence? (Multiple choice)",
    options: JSON.stringify([
      { value: "control_grupos", label: "Control de grupos organizados", labelEn: "Control of organised groups" },
      { value: "espacios_peatonales", label: "Espacios peatonales", labelEn: "Pedestrian spaces" },
      { value: "regulacion_accesos", label: "Regulación de accesos o tráfico", labelEn: "Regulation of access or traffic" },
      { value: "senalizacion", label: "Señalización y rutas turísticas dirigidas", labelEn: "Signage and guided tourist routes" },
      { value: "campanas_sensibilizacion", label: "Campañas de sensibilización", labelEn: "Awareness campaigns" },
      { value: "otra", label: "Otra (especificar)", labelEn: "Other (specify)" },
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
  console.log(`  ✓ [${q.order}] ${q.text.substring(0, 60)}...`);
}

console.log(`\n✅ Plantilla "${templateId}" creada con ${inserted} preguntas.`);
await connection.end();
