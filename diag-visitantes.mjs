import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Get visitantes template
const [tmplRows] = await conn.execute("SELECT id, type FROM survey_templates WHERE type='visitantes' LIMIT 1");
const tmpl = tmplRows[0];
console.log('Template:', tmpl);

const [qRows] = await conn.execute(
  "SELECT id, templateId, `order`, type FROM questions WHERE templateId=? ORDER BY `order`",
  [tmpl.id]
);

console.log('\nQuestions (order, code, type → colIdx → colName):');
const metaCount = 4;
for (const q of qRows) {
  const colIdx = q.order - metaCount;
  const colName = `r_p${String(colIdx).padStart(2,'0')}`;
  console.log(`  order=${q.order} type=${q.type} → colIdx=${colIdx} → ${colName}`);
}

// Check which columns exist in survey_responses
const [colRows] = await conn.execute(
  "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='survey_responses' AND COLUMN_NAME LIKE 'r_p%' ORDER BY ORDINAL_POSITION"
);
console.log('\nExisting r_p columns in survey_responses:');
colRows.forEach(c => console.log(`  ${c.COLUMN_NAME} (${c.DATA_TYPE}(${c.CHARACTER_MAXIMUM_LENGTH}))`));

await conn.end();
