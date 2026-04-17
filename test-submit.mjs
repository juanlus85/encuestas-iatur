/**
 * Simula el submit de una encuesta de residentes completa (41 preguntas)
 * para reproducir el error 500 y ver el mensaje exacto.
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Importar las funciones del servidor directamente
const { createSurveyResponse } = await import("./server/db.ts").catch(async () => {
  // Si falla con .ts, intentar con el compilado
  return { createSurveyResponse: null };
});

// Simular lo que hace routers.ts: construir flatCols para 41 preguntas
// Template 90001, metaCount=4, orders 5..41 → colIdx 1..37
const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Obtener las preguntas del template
const [questions] = await conn.execute(
  "SELECT id, `order`, type, text FROM questions WHERE templateId = 90001 ORDER BY `order`"
);

console.log(`Total preguntas: ${questions.length}`);

// Simular respuestas para todas las preguntas
const answers = questions.map((q) => ({
  questionId: q.id,
  answer: q.type === "yes_no" ? "si" : q.type === "scale" ? "3" : q.type === "multiple_choice" ? JSON.stringify(["op1"]) : "test_value"
}));

// Construir flatCols como lo hace routers.ts
const metaCount = 4;
const realQuestions = questions.filter((q) => !q.text.startsWith("META:"));
const flatCols = {};
const answerByOrder = {};
answers.forEach((a) => {
  const q = questions.find((q) => q.id === a.questionId);
  if (q) answerByOrder[q.order] = a.answer;
});

for (const q of realQuestions) {
  const colIdx = q.order - metaCount;
  const rawVal = answerByOrder[q.order] ?? null;
  
  if (colIdx === 36) {
    // P13 múltiple
    let vals = [];
    try { vals = rawVal ? JSON.parse(rawVal) : []; } catch { vals = rawVal ? [rawVal] : []; }
    flatCols["r_p35a"] = vals[0] ?? null;
    flatCols["r_p35b"] = vals[1] ?? null;
    flatCols["r_p35c"] = vals[2] ?? null;
  } else {
    const colName = `r_p${String(colIdx).padStart(2, "0")}`;
    flatCols[colName] = rawVal;
  }
}

// Calcular seccion037
const viveCentro = flatCols["r_p02"];
if (viveCentro === "si" || viveCentro === "1") {
  flatCols["seccion037"] = "1";
} else {
  flatCols["seccion037"] = "2";
}

console.log("flatCols generados:", Object.keys(flatCols).sort().join(", "));
console.log("Número de columnas r_p:", Object.keys(flatCols).filter(k => k.startsWith("r_p")).length);

// Intentar el INSERT directamente
try {
  const colNames = Object.keys(flatCols);
  const placeholders = colNames.map(() => "?").join(", ");
  const values = colNames.map((k) => flatCols[k]);
  
  const sql = `INSERT INTO survey_responses (templateId, encuestadorId, encuestadorName, encuestadorIdentifier, deviceInfo, surveyPoint, timeSlot, latitude, longitude, gpsAccuracy, startedAt, finishedAt, language, answers, windowCode, minuteStart, minuteEnd, earlyExit, ${colNames.join(", ")}, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ${placeholders}, ?)`;
  
  const allValues = [90001, 1, "TestUser", "T99", "{}", "01", "tarde", 37.38, -5.99, 5.0, "es", "[]", "V1", 1, 2, 0, ...values, "completa"];
  
  await conn.execute(sql, allValues);
  console.log("✅ INSERT exitoso");
  await conn.execute("DELETE FROM survey_responses WHERE encuestadorIdentifier = 'T99'");
} catch (e) {
  console.error("❌ INSERT falló:", e.message);
  console.error("SQL Error code:", e.code);
  console.error("SQL Error errno:", e.errno);
}

await conn.end();
