/**
 * Seed: Encuesta de Residentes v5 (definitiva)
 * Basada en "Encuestaresidentes_v5-Copia.docx"
 * Ejecutar: node seed-residentes.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Borrar plantilla anterior de residentes
const [templates] = await conn.execute("SELECT id FROM survey_templates WHERE type = 'residentes'");
for (const t of templates) {
  await conn.execute("DELETE FROM questions WHERE templateId = ?", [t.id]);
  await conn.execute("DELETE FROM survey_templates WHERE id = ?", [t.id]);
}

// Crear plantilla
const [result] = await conn.execute(
  `INSERT INTO survey_templates (name, nameEn, type, description, targetCount, isActive) VALUES (?, ?, ?, ?, ?, ?)`,
  ["Encuesta de Residentes", "Residents Survey", "residentes",
   "Opinión de los residentes sobre los efectos del turismo. Barrio de Santa Cruz, Sevilla 2026. N=300.", 300, 1]
);
const templateId = result.insertId;
console.log("Template ID:", templateId);

const questions = [
  // METADATOS
  { order:1, type:"text", text:"META: Código cuestionario", textEn:"META: Questionnaire code", options:null, isRequired:false },
  { order:2, type:"single_choice", text:"META: Punto de encuesta", textEn:"META: Survey point",
    options:JSON.stringify([{value:"01",label:"01 Virgen de los Reyes"},{value:"02",label:"02 Mateos Gago"},{value:"03",label:"03 Patio de Banderas"},{value:"04",label:"04 Agua/Vida"},{value:"05",label:"05 Plaza Alfaro"}]), isRequired:true },
  { order:3, type:"single_choice", text:"META: Bloque horario", textEn:"META: Time block",
    options:JSON.stringify([{value:"manana",label:"Mañana (9:30–12:00)"},{value:"mediodia",label:"Mediodía (12:00–14:30)"},{value:"tarde",label:"Tarde (16:00–18:30)"},{value:"noche",label:"Noche (18:30–21:00)"}]), isRequired:true },
  { order:4, type:"single_choice", text:"META: Ventana (tramo 30 min)", textEn:"META: Window (30-min slot)",
    options:JSON.stringify([{value:"V1",label:"V1 (0–30 min)"},{value:"V2",label:"V2 (30–60 min)"},{value:"V3",label:"V3 (60–90 min)"},{value:"V4",label:"V4 (90–120 min)"},{value:"V5",label:"V5 (120–150 min)"}]), isRequired:true },
  // SECCIÓN 1: Perfil
  { order:5, type:"yes_no", text:"P1. ¿Reside habitualmente en este barrio? (Si NO → fin de encuesta)", textEn:"P1. Do you usually reside in this neighbourhood? (If NO → end survey)",
    options:JSON.stringify([{value:"si",label:"Sí"},{value:"no",label:"No (fin de encuesta)"}]), isRequired:true },
  { order:6, type:"text", text:"P1.1. ¿En qué calle?", textEn:"P1.1. Which street?", options:null, isRequired:false },
  { order:7, type:"single_choice", text:"P2. ¿Cuántos años lleva viviendo en el barrio?", textEn:"P2. How many years have you lived in the neighbourhood?",
    options:JSON.stringify([{value:"menos_1",label:"Menos de 1 año"},{value:"1_5",label:"1–5 años"},{value:"6_15",label:"6–15 años"},{value:"mas_15",label:"Más de 15 años"}]), isRequired:true },
  { order:8, type:"single_choice", text:"P3. ¿Percibe usted, o algún miembro de su hogar, beneficios económicos del sector turístico? (hotel, alojamiento, restaurantes, transporte turístico, agencias, museos, guías...)", textEn:"P3. Do you or any household member receive income from tourism-related activities?",
    options:JSON.stringify([{value:"si_yo",label:"Sí, yo"},{value:"si_otro",label:"Sí, otra persona del hogar"},{value:"no",label:"No"}]), isRequired:true },
  { order:9, type:"single_choice", text:"P4. Género", textEn:"P4. Gender",
    options:JSON.stringify([{value:"mujer",label:"Mujer"},{value:"hombre",label:"Hombre"},{value:"otro",label:"Otro / prefiero no decirlo"}]), isRequired:true },
  { order:10, type:"single_choice", text:"P5. Edad", textEn:"P5. Age",
    options:JSON.stringify([{value:"18_29",label:"18–29"},{value:"30_44",label:"30–44"},{value:"45_64",label:"45–64"},{value:"65_75",label:"65–75"},{value:"76_mas",label:"76 o más"}]), isRequired:true },
  // SECCIÓN 2: Efectos del turismo (15 ítems Likert)
  { order:11, type:"scale", text:"P6.01. El turismo mejora la economía local y aumenta las posibilidades de empleo (1=Totalmente desacuerdo, 5=Totalmente de acuerdo)", textEn:"P6.01. Tourism improves the local economy and increases employment opportunities",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:12, type:"scale", text:"P6.02. El turismo genera congestión en el espacio, infraestructuras o servicios públicos (transporte, sanidad, basura, etc.)", textEn:"P6.02. Tourism generates congestion in public spaces, infrastructure or services",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:13, type:"scale", text:"P6.03. El turismo atrae nuevos inversores", textEn:"P6.03. Tourism attracts new investors",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:14, type:"scale", text:"P6.04. El turismo encarece el precio de las viviendas (alquiler y venta)", textEn:"P6.04. Tourism increases housing prices",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:15, type:"scale", text:"P6.05. El turismo aumenta la calidad de vida de la población residente", textEn:"P6.05. Tourism increases the quality of life of the resident population",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:16, type:"scale", text:"P6.06. El turismo está provocando desplazamientos de la población local a zonas alejadas del centro", textEn:"P6.06. Tourism is causing displacement of the local population",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:17, type:"scale", text:"P6.07. El turismo ayuda a mejorar el prestigio e imagen de mi ciudad", textEn:"P6.07. Tourism helps improve the prestige and image of my city",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:18, type:"scale", text:"P6.08. El turismo contribuye a la pérdida de identidad, cultura y tradiciones del municipio", textEn:"P6.08. Tourism contributes to the loss of identity, culture and traditions",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:19, type:"scale", text:"P6.09. El turismo ayuda a conservar y revalorizar los monumentos", textEn:"P6.09. Tourism helps conserve and enhance monuments",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:20, type:"scale", text:"P6.10. El turismo trae consigo un aumento del tráfico en mi ciudad y falta de aparcamiento", textEn:"P6.10. Tourism brings increased traffic and lack of parking",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:21, type:"scale", text:"P6.11. El turismo incrementa las opciones de ocio", textEn:"P6.11. Tourism increases leisure options",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:22, type:"scale", text:"P6.12. El turismo mejora servicios (limpieza o seguridad) de la ciudad", textEn:"P6.12. Tourism improves city services (cleaning or security)",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:23, type:"scale", text:"P6.13. El turismo consume recursos (agua, energía, suelo, etc.) que condiciona el uso a la población residente", textEn:"P6.13. Tourism consumes resources that limit their use by residents",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:24, type:"scale", text:"P6.14. El turismo aumenta los niveles de contaminación (acústica, lumínica, etc.) y la suciedad", textEn:"P6.14. Tourism increases pollution levels and dirtiness",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  { order:25, type:"scale", text:"P6.15. El turismo contribuye a crear una sociedad más tolerante y multicultural", textEn:"P6.15. Tourism contributes to creating a more tolerant and multicultural society",
    options:JSON.stringify([{value:"1",label:"1 – Totalmente desacuerdo"},{value:"2",label:"2"},{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5 – Totalmente de acuerdo"},{value:"ns",label:"NS/NC"}]), isRequired:true },
  // SECCIÓN 3: Usos habituales y movilidad
  { order:26, type:"single_choice", text:"P7a. Frecuencia: Ir a comercios o servicios de proximidad", textEn:"P7a. Frequency: Going to local shops or services",
    options:JSON.stringify([{value:"diario",label:"Diario"},{value:"varias_semana",label:"Varias veces/semana"},{value:"1_semana",label:"1 vez/semana"},{value:"menos_1_semana",label:"Menos de 1 vez/semana"},{value:"nunca",label:"Nunca"}]), isRequired:true },
  { order:27, type:"single_choice", text:"P7b. Frecuencia: Acompañamiento escolar o familiar", textEn:"P7b. Frequency: School or family accompaniment",
    options:JSON.stringify([{value:"diario",label:"Diario"},{value:"varias_semana",label:"Varias veces/semana"},{value:"1_semana",label:"1 vez/semana"},{value:"menos_1_semana",label:"Menos de 1 vez/semana"},{value:"nunca",label:"Nunca"}]), isRequired:true },
  { order:28, type:"single_choice", text:"P7c. Frecuencia: Ocio o actividades comunitarias (asociaciones)", textEn:"P7c. Frequency: Leisure or community activities",
    options:JSON.stringify([{value:"diario",label:"Diario"},{value:"varias_semana",label:"Varias veces/semana"},{value:"1_semana",label:"1 vez/semana"},{value:"menos_1_semana",label:"Menos de 1 vez/semana"},{value:"nunca",label:"Nunca"}]), isRequired:true },
  { order:29, type:"single_choice", text:"P7d. Frecuencia: Trayectos al trabajo", textEn:"P7d. Frequency: Commuting to work",
    options:JSON.stringify([{value:"diario",label:"Diario"},{value:"varias_semana",label:"Varias veces/semana"},{value:"1_semana",label:"1 vez/semana"},{value:"menos_1_semana",label:"Menos de 1 vez/semana"},{value:"nunca",label:"Nunca"}]), isRequired:true },
  { order:30, type:"single_choice", text:"P7e. Frecuencia: Uso de transporte público (metro, bus, tranvía)", textEn:"P7e. Frequency: Use of public transport",
    options:JSON.stringify([{value:"diario",label:"Diario"},{value:"varias_semana",label:"Varias veces/semana"},{value:"1_semana",label:"1 vez/semana"},{value:"menos_1_semana",label:"Menos de 1 vez/semana"},{value:"nunca",label:"Nunca"}]), isRequired:true },
  { order:31, type:"single_choice", text:"P7f. Frecuencia: Circulación a pie o en bicicleta", textEn:"P7f. Frequency: Walking or cycling",
    options:JSON.stringify([{value:"diario",label:"Diario"},{value:"varias_semana",label:"Varias veces/semana"},{value:"1_semana",label:"1 vez/semana"},{value:"menos_1_semana",label:"Menos de 1 vez/semana"},{value:"nunca",label:"Nunca"}]), isRequired:true },
  { order:32, type:"single_choice", text:"P8. ¿Ha modificado su comportamiento por la presencia de turistas en los últimos años?", textEn:"P8. Have you modified your behaviour due to the presence of tourists in recent years?",
    options:JSON.stringify([{value:"evito_calles",label:"Sí, evito ciertas calles o plazas"},{value:"cambio_horario",label:"Sí, cambio de horario habitualmente"},{value:"reducido_uso",label:"Sí, he reducido el uso de algún espacio"},{value:"no",label:"No, no he cambiado mis hábitos"}]), isRequired:true },
  // SECCIÓN 4: Convivencia y espacio público
  { order:33, type:"multiple_choice", text:"P9. ¿Ha experimentado alguna de estas situaciones en el último mes? (Múltiple respuesta)", textEn:"P9. Have you experienced any of these situations in the last month? (Multiple choice)",
    options:JSON.stringify([{value:"dificultad_caminar",label:"Dificultad para caminar por saturación"},{value:"inseguridad_vial",label:"Sensación de inseguridad vial"},{value:"ruido",label:"Ruido o actividades molestas"},{value:"cambios_rutas",label:"Cambios en sus rutas habituales"},{value:"dificultad_acceso",label:"Dificultad de acceso a comercios/servicios"},{value:"perdida_identidad",label:"Sensación de pérdida de identidad del barrio"},{value:"ninguna",label:"Ninguna de las anteriores"}]), isRequired:true },
  { order:34, type:"scale", text:"P10. ¿La presencia turística ha cambiado su uso habitual del espacio público? (1=Nada, 5=Muchísimo)", textEn:"P10. Has the tourist presence changed your usual use of public space? (1=Not at all, 5=A lot)",
    options:JSON.stringify([{value:"1",label:"1 – Nada"},{value:"2",label:"2 – Poco"},{value:"3",label:"3 – Algo"},{value:"4",label:"4 – Mucho"},{value:"5",label:"5 – Muchísimo"}]), isRequired:true },
  // SECCIÓN 5: Valoración global
  { order:35, type:"scale", text:"P11. ¿Cómo considera que le afecta personalmente el turismo? (1=Muy negativo, 5=Muy positivo)", textEn:"P11. How do you think tourism personally affects you? (1=Very negative, 5=Very positive)",
    options:JSON.stringify([{value:"1",label:"1 – Muy negativo"},{value:"2",label:"2 – Algo negativo"},{value:"3",label:"3 – Neutral"},{value:"4",label:"4 – Algo positivo"},{value:"5",label:"5 – Muy positivo"}]), isRequired:true },
  { order:36, type:"scale", text:"P12. ¿Cómo considera que afecta el turismo a su comunidad? (1=Muy negativo, 5=Muy positivo)", textEn:"P12. How do you think tourism affects your community? (1=Very negative, 5=Very positive)",
    options:JSON.stringify([{value:"1",label:"1 – Muy negativo"},{value:"2",label:"2 – Algo negativo"},{value:"3",label:"3 – Neutral"},{value:"4",label:"4 – Algo positivo"},{value:"5",label:"5 – Muy positivo"}]), isRequired:true },
  { order:37, type:"multiple_choice", text:"P13. ¿Qué medidas deberían priorizarse para mejorar la movilidad y la convivencia? (Hasta 3 opciones)", textEn:"P13. What measures should be prioritised to improve mobility and coexistence? (Up to 3 options)",
    options:JSON.stringify([{value:"control_grupos",label:"Control y regulación de grupos organizados"},{value:"zonas_peatonales",label:"Ampliación de zonas peatonales"},{value:"regulacion_accesos",label:"Regulación de accesos o tráfico"},{value:"senalizacion",label:"Señalización y rutas turísticas dirigidas"},{value:"sensibilizacion",label:"Campañas de sensibilización (turistas y vecinos)"},{value:"limitacion_horaria",label:"Limitación horaria de actividades turísticas"},{value:"agentes_movilidad",label:"Mayor presencia de agentes de movilidad (policía)"},{value:"otra",label:"Otra (especificar)"}]), isRequired:false },
  // SECCIÓN 6: Cierre
  { order:38, type:"text", text:"P14. ¿Desea añadir alguna observación o comentario final?", textEn:"P14. Would you like to add any final observation or comment?", options:null, isRequired:false },
];

for (const q of questions) {
  await conn.execute(
    "INSERT INTO questions (templateId, `order`, type, text, textEn, options, isRequired, requiresPhoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [templateId, q.order, q.type, q.text, q.textEn||null, q.options||null, q.isRequired?1:0, 0]
  );
}

console.log(`✅ Encuesta residentes v5: ${questions.length} preguntas insertadas. Template ID: ${templateId}`);
await conn.end();
