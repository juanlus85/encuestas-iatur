/**
 * offlineStore.ts
 * Almacenamiento offline con IndexedDB para encuestas y conteos peatonales.
 * Cuando el dispositivo pierde la conexión, los datos se guardan localmente.
 * Al recuperar la conexión, se sincronizan automáticamente con el servidor.
 */

const DB_NAME = "iatur_offline";
const DB_VERSION = 1;

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface OfflineSurvey {
  localId: string;
  synced: boolean;
  syncAttempts: number;
  savedAt: number; // timestamp ms
  data: {
    templateId: number;
    surveyPoint?: string;
    timeSlot?: string;
    latitude?: number;
    longitude?: number;
    gpsAccuracy?: number;
    startedAt: Date;
    finishedAt?: Date;
    language?: string;
    answers: { questionId: number; answer: any }[];
    status?: string;
    deviceInfo?: string;
  };
}

export interface OfflinePedestrianPass {
  localId: string;
  synced: boolean;
  syncAttempts: number;
  savedAt: number;
  data: {
    sessionId: number;
    fromPoint: string;
    toPoint: string;
    latitude?: number;
    longitude?: number;
    gpsAccuracy?: number;
    recordedAt: Date;
  };
}

// ─── Inicialización de la BD ──────────────────────────────────────────────────

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("surveys")) {
        const store = db.createObjectStore("surveys", { keyPath: "localId" });
        store.createIndex("synced", "synced", { unique: false });
      }
      if (!db.objectStoreNames.contains("passes")) {
        const store = db.createObjectStore("passes", { keyPath: "localId" });
        store.createIndex("synced", "synced", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Encuestas offline ────────────────────────────────────────────────────────

export async function saveOfflineSurvey(data: OfflineSurvey["data"]): Promise<string> {
  const db = await openDb();
  const localId = generateLocalId();
  const record: OfflineSurvey = {
    localId,
    synced: false,
    syncAttempts: 0,
    savedAt: Date.now(),
    data,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction("surveys", "readwrite");
    tx.objectStore("surveys").add(record);
    tx.oncomplete = () => resolve(localId);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingSurveys(): Promise<OfflineSurvey[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("surveys", "readonly");
    const index = tx.objectStore("surveys").index("synced");
    const req = index.getAll(IDBKeyRange.only(false));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function markSurveySynced(localId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("surveys", "readwrite");
    const store = tx.objectStore("surveys");
    const req = store.get(localId);
    req.onsuccess = () => {
      const record = req.result as OfflineSurvey;
      if (record) {
        record.synced = true;
        store.put(record);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function incrementSurveyAttempts(localId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("surveys", "readwrite");
    const store = tx.objectStore("surveys");
    const req = store.get(localId);
    req.onsuccess = () => {
      const record = req.result as OfflineSurvey;
      if (record) {
        record.syncAttempts++;
        store.put(record);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function countPendingSurveys(): Promise<number> {
  const pending = await getPendingSurveys();
  return pending.length;
}

// ─── Pases peatonales offline ─────────────────────────────────────────────────

export async function saveOfflinePass(data: OfflinePedestrianPass["data"]): Promise<string> {
  const db = await openDb();
  const localId = generateLocalId();
  const record: OfflinePedestrianPass = {
    localId,
    synced: false,
    syncAttempts: 0,
    savedAt: Date.now(),
    data,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction("passes", "readwrite");
    tx.objectStore("passes").add(record);
    tx.oncomplete = () => resolve(localId);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPendingPasses(): Promise<OfflinePedestrianPass[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("passes", "readonly");
    const index = tx.objectStore("passes").index("synced");
    const req = index.getAll(IDBKeyRange.only(false));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function markPassSynced(localId: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("passes", "readwrite");
    const store = tx.objectStore("passes");
    const req = store.get(localId);
    req.onsuccess = () => {
      const record = req.result as OfflinePedestrianPass;
      if (record) {
        record.synced = true;
        store.put(record);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function countPendingPasses(): Promise<number> {
  const pending = await getPendingPasses();
  return pending.length;
}
