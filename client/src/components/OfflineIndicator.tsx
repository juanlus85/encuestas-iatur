/**
 * OfflineIndicator.tsx
 * Indicador de estado de conexión para encuestadores.
 * Muestra un banner cuando no hay conexión y el número de datos pendientes de sincronizar.
 */

import { useEffect, useState } from "react";
import { WifiOff, Wifi, RefreshCw, AlertCircle } from "lucide-react";
import { useOnlineStatus, usePendingCount, useOfflineSync } from "@/hooks/useOfflineSync";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { pendingSurveys, pendingPasses, refresh } = usePendingCount();
  const { syncNow } = useOfflineSync();
  const [syncing, setSyncing] = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setJustCameOnline(true);
      const timer = setTimeout(() => setJustCameOnline(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncNow();
      await refresh();
    } catch {
      toast.error("Error al sincronizar. Inténtalo de nuevo.");
    } finally {
      setSyncing(false);
    }
  };

  const hasPending = pendingSurveys > 0 || pendingPasses > 0;

  // Sin conexión
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
        <WifiOff className="h-4 w-4 shrink-0" />
        <span>Sin conexión — Los datos se guardan localmente</span>
        {hasPending && (
          <span className="ml-2 bg-white/20 rounded-full px-2 py-0.5 text-xs">
            {pendingSurveys + pendingPasses} pendiente{pendingSurveys + pendingPasses !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    );
  }

  // Acaba de recuperar la conexión con datos pendientes
  if (hasPending) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium shadow-lg">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>
          {pendingSurveys > 0 && `${pendingSurveys} encuesta${pendingSurveys !== 1 ? "s" : ""}`}
          {pendingSurveys > 0 && pendingPasses > 0 && " y "}
          {pendingPasses > 0 && `${pendingPasses} conteo${pendingPasses !== 1 ? "s" : ""}`}
          {" "}pendiente{(pendingSurveys + pendingPasses) !== 1 ? "s" : ""} de sincronizar
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSync}
          disabled={syncing}
          className="h-7 text-xs bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white"
        >
          {syncing ? (
            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Sincronizar ahora
        </Button>
      </div>
    );
  }

  // Acaba de volver online y ya está sincronizado
  if (justCameOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top">
        <Wifi className="h-4 w-4" />
        <span>Conexión restaurada — Todo sincronizado</span>
      </div>
    );
  }

  return null;
}
