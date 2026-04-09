/**
 * useOfflineSync.ts
 * Hook que detecta la conexión a internet y sincroniza automáticamente
 * los datos guardados en IndexedDB cuando se recupera la conexión.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  getPendingSurveys,
  getPendingPasses,
  markSurveySynced,
  markPassSynced,
  incrementSurveyAttempts,
  countPendingSurveys,
  countPendingPasses,
} from "@/lib/offlineStore";
import { trpc } from "@/lib/trpc";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export function usePendingCount() {
  const [pendingSurveys, setPendingSurveys] = useState(0);
  const [pendingPasses, setPendingPasses] = useState(0);

  const refresh = useCallback(async () => {
    const [s, p] = await Promise.all([countPendingSurveys(), countPendingPasses()]);
    setPendingSurveys(s);
    setPendingPasses(p);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { pendingSurveys, pendingPasses, refresh };
}

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const utils = trpc.useUtils();
  const submitSurvey = trpc.responses.submit.useMutation();
  const submitPass = trpc.passes.add.useMutation();
  const syncingRef = useRef(false);
  const { refresh: refreshPending } = usePendingCount();

  const syncNow = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    try {
      const [surveys, passes] = await Promise.all([
        getPendingSurveys(),
        getPendingPasses(),
      ]);

      let syncedSurveys = 0;
      let syncedPasses = 0;

      // Sincronizar encuestas
      for (const survey of surveys) {
        if (survey.syncAttempts >= 5) continue; // Abandonar tras 5 intentos
        try {
          await submitSurvey.mutateAsync({
            ...survey.data,
            startedAt: new Date(survey.data.startedAt),
            finishedAt: survey.data.finishedAt ? new Date(survey.data.finishedAt) : undefined,
            timeSlot: survey.data.timeSlot as any,
            language: survey.data.language as any,
            status: survey.data.status as any,
          });
          await markSurveySynced(survey.localId);
          syncedSurveys++;
        } catch {
          await incrementSurveyAttempts(survey.localId);
        }
      }

      // Sincronizar pases peatonales
      for (const pass of passes) {
        try {
          await submitPass.mutateAsync({
            surveyPoint: pass.data.fromPoint,
            directionLabel: `${pass.data.fromPoint} → ${pass.data.toPoint}`,
            count: 1,
            latitude: pass.data.latitude,
            longitude: pass.data.longitude,
            gpsAccuracy: pass.data.gpsAccuracy,
            recordedAt: new Date(pass.data.recordedAt),
          });
          await markPassSynced(pass.localId);
          syncedPasses++;
        } catch {
          // Ignorar errores de pases individuales
        }
      }

      if (syncedSurveys > 0 || syncedPasses > 0) {
        toast.success(
          `Sincronización completada: ${syncedSurveys} encuesta${syncedSurveys !== 1 ? "s" : ""} y ${syncedPasses} conteo${syncedPasses !== 1 ? "s" : ""} enviados.`
        );
        utils.responses.invalidate();
        utils.passes.invalidate();
        refreshPending();
      }
    } finally {
      syncingRef.current = false;
    }
  }, [submitSurvey, submitPass, utils, refreshPending]);

  // Sincronizar automáticamente al recuperar la conexión
  useEffect(() => {
    if (isOnline) {
      // Pequeño delay para asegurar que la conexión es estable
      const timer = setTimeout(() => syncNow(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, syncNow]);

  return { isOnline, syncNow };
}
