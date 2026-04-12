import { getDb } from './server/db';
import { surveyResponses } from './drizzle/schema';
import { desc } from 'drizzle-orm';

const db = await getDb();
const rows = await db.select().from(surveyResponses).orderBy(desc(surveyResponses.id)).limit(5);
for (const r of rows) {
  const rAny = r as any;
  console.log(`ID ${r.id}: v_p01=${JSON.stringify(rAny.v_p01)} v_p02=${JSON.stringify(rAny.v_p02)} v_p03=${JSON.stringify(rAny.v_p03)}`);
}
process.exit(0);
