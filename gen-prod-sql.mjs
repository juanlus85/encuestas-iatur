/**
 * Genera el SQL de producción para la encuesta de residentes v6
 * Ejecutar: node gen-prod-sql.mjs
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  "SELECT `order`, type, text, textEn, options, isRequired FROM questions WHERE templateId = 90001 ORDER BY `order`"
);

const escSql = (s) => (s ?? "").replace(/'/g, "''").replace(/\\/g, "\\\\");

let inserts = "";
for (const r of rows) {
  const text = escSql(r.text);
  const textEn = r.textEn ? `'${escSql(r.textEn)}'` : "NULL";
  const opts = r.options ? `'${escSql(typeof r.options === "string" ? r.options : JSON.stringify(r.options))}'` : "NULL";
  inserts += `INSERT INTO questions (templateId, \`order\`, type, text, textEn, options, isRequired, requiresPhoto) VALUES (@TEMPLATE_ID, ${r.order}, '${r.type}', '${text}', ${textEn}, ${opts}, ${r.isRequired ? 1 : 0}, 0);\n`;
}

await conn.end();

const sql = `-- ============================================================
-- SQL PRODUCCIÓN: Encuesta Residentes v6
-- Fecha: ${new Date().toISOString().split("T")[0]}
-- INSTRUCCIONES:
--   1. Ejecutar en la BD de producción ANTES de publicar
--   2. Sustituir @TEMPLATE_ID por el ID real del template de residentes en producción
--      (ejecutar: SELECT id FROM survey_templates WHERE type='residentes')
--   3. Si ya hay encuestas grabadas con el template anterior, NO borrar las preguntas
--      antiguas directamente — usar UPDATE para los textos y INSERT para las nuevas.
-- ============================================================

-- PASO 1: Obtener el ID del template de residentes en producción
-- SELECT @TEMPLATE_ID := id FROM survey_templates WHERE type = 'residentes';
-- (o usar SET @TEMPLATE_ID = <id_obtenido>;)

-- PASO 2: Borrar las preguntas antiguas del template de residentes
DELETE FROM questions WHERE templateId = @TEMPLATE_ID;

-- PASO 3: Insertar las nuevas preguntas (v6 con 41 preguntas)
${inserts}
-- PASO 4: Actualizar descripción y targetCount del template
UPDATE survey_templates
SET description = 'Opinión de los residentes sobre los efectos del turismo. Barrio de Santa Cruz, Sevilla 2026. N=300.',
    targetCount = 300
WHERE id = @TEMPLATE_ID;

-- PASO 5: Verificación
SELECT COUNT(*) AS total_preguntas FROM questions WHERE templateId = @TEMPLATE_ID;
-- Debe devolver: 41

SELECT \`order\`, type, LEFT(text, 60) AS texto
FROM questions
WHERE templateId = @TEMPLATE_ID
ORDER BY \`order\`;
`;

fs.writeFileSync("produccion_residentes_v6.sql", sql, "utf8");
console.log("✅ SQL generado en produccion_residentes_v6.sql");
console.log(`Total preguntas: ${rows.length}`);
