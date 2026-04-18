import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Datos exactos de la imagen del error
// params: 60001,60011,ConchaEnc,ENC1,...,es,
// answers: questionId 60007..60026
// v_p01=V3, v_p02=espana, v_p03=madrid, v_p04=2_3_veces, v_p05=1_noche, v_p06=65_75
// v_p07=1, v_p08=turismo_cultural, v_p09=solo, v_p10=3, v_p11=autobus_tranvia
// v_p12=recomendacion, v_p13=evite_lugar, v_p14=3, v_p15=4, v_p16=muy_agradable
// v_p17=3, v_p18=contemplar, v_p19=weewe, v_p20=wwwe, (v_p21=2, v_p22=completa)

// Verificar qué columnas v_p existen en la BD
const [colRows] = await conn.execute(
  "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='survey_responses' AND COLUMN_NAME LIKE 'v_p%' ORDER BY ORDINAL_POSITION"
);
console.log('v_p columns in BD:');
colRows.forEach(c => console.log(`  ${c.COLUMN_NAME} (${c.DATA_TYPE}(${c.CHARACTER_MAXIMUM_LENGTH}))`));

// Intentar un INSERT de prueba con los valores de la imagen
try {
  await conn.execute(
    `INSERT INTO survey_responses (templateId, encuestadorId, encuestadorName, encuestadorIdentifier, surveyPoint, language, status,
     v_p01, v_p02, v_p03, v_p04, v_p05, v_p06, v_p07, v_p08, v_p09, v_p10, v_p11, v_p12, v_p13, v_p14, v_p15, v_p16, v_p17, v_p18, v_p19, v_p20)
     VALUES (60001, 1, 'Test', 'TEST', '01', 'es', 'completa',
     'V3', 'espana', 'madrid', '2_3_veces', '1_noche', '65_75', '1', 'turismo_cultural', 'solo', '3', 'autobus_tranvia', 'recomendacion', 'evite_lugar', '3', '4', 'muy_agradable', '3', 'contemplar', 'weewe', 'wwwe')`,
    []
  );
  console.log('\n✅ INSERT de prueba exitoso');
  // Limpiar
  await conn.execute("DELETE FROM survey_responses WHERE encuestadorName='Test' AND encuestadorIdentifier='TEST'");
} catch (err) {
  console.error('\n❌ Error en INSERT:', err.message);
  console.error('  code:', err.code);
  console.error('  sqlMessage:', err.sqlMessage);
}

await conn.end();
