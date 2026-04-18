import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) { console.error('No DATABASE_URL'); process.exit(1); }

// Parse DATABASE_URL: mysql://user:pass@host:port/db
const conn = await mysql.createConnection(url);

// Primero ver qué se va a borrar
const [rows] = await conn.execute(
  'SELECT id, surveyPoint, surveyPointCode, count FROM pedestrian_passes WHERE surveyPointCode IS NULL OR surveyPointCode = ""'
);
console.log('Registros a eliminar:', JSON.stringify(rows, null, 2));

if (rows.length === 0) {
  console.log('No hay registros huérfanos.');
  await conn.end();
  process.exit(0);
}

const [result] = await conn.execute(
  'DELETE FROM pedestrian_passes WHERE surveyPointCode IS NULL OR surveyPointCode = ""'
);
console.log('Eliminados:', result.affectedRows, 'registros');
await conn.end();
process.exit(0);
