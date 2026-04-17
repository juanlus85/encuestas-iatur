import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [cols] = await conn.execute("SHOW COLUMNS FROM survey_responses");
const colNames = cols.map((c) => c.Field);

const needed = [
  "r_p01","r_p02","r_p03","r_p04","r_p05","r_p06","r_p07","r_p08","r_p09","r_p10",
  "r_p11","r_p12","r_p13","r_p14","r_p15","r_p16","r_p17","r_p18","r_p19","r_p20",
  "r_p21","r_p22","r_p23","r_p24","r_p25","r_p26","r_p27","r_p28","r_p29","r_p30",
  "r_p31","r_p32","r_p33","r_p34","r_p35a","r_p35b","r_p35c","r_p36","seccion037"
];

const missing = needed.filter((c) => !colNames.includes(c));
console.log("Columnas faltantes:", missing.length === 0 ? "NINGUNA" : missing.join(", "));
console.log("Todas las columnas necesarias existen:", missing.length === 0);

// Ahora intentar un INSERT de prueba para ver si falla
try {
  await conn.execute(
    "INSERT INTO survey_responses (templateId, encuestadorId, encuestadorName, encuestadorIdentifier, deviceInfo, surveyPoint, timeSlot, latitude, longitude, gpsAccuracy, startedAt, finishedAt, language, answers, windowCode, minuteStart, minuteEnd, earlyExit, r_p01, r_p02, seccion037, r_p36, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [90001, 1, "Test", "T1", "{}", "01", "tarde", 37.38, -5.99, 5.0, "es", "[]", "V1", 1, 2, 0, "1", "calle_test", 1, "test_obs", "completa"]
  );
  console.log("INSERT de prueba: OK");
  // Limpiar
  await conn.execute("DELETE FROM survey_responses WHERE encuestadorName = 'Test' AND encuestadorIdentifier = 'T1'");
} catch (e) {
  console.error("INSERT de prueba FALLÓ:", e.message);
}

await conn.end();
