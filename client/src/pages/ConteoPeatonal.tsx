import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, ChevronLeft, Plus, ArrowRight, ArrowLeftRight, Play, Square, Timer } from "lucide-react";
import { Link } from "wouter";
import { SURVEY_POINTS, getFlowsForPoint, type SurveyPoint, type SurveySubPoint } from "../../../shared/surveyPoints";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ConteoPeatonal() {
  const { user } = useAuth();

  // Pasos: punto → subpunto → conteo
  const [step, setStep] = useState<"punto" | "subpunto" | "conteo">("punto");
  const [selectedPoint, setSelectedPoint] = useState<SurveyPoint | null>(null);
  const [selectedSubPoint, setSelectedSubPoint] = useState<SurveySubPoint | null>(null);

  // Flujo seleccionado (persiste entre registros)
  const [selectedFlow, setSelectedFlow] = useState<{ label: string; from: string; to: string; fromCode: string; toCode: string } | null>(null);

  // Dialog grupo grande
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupCount, setGroupCount] = useState("");
  const groupInputRef = useRef<HTMLInputElement>(null);

  // GPS
  const [gps, setGps] = useState<{ lat: number; lng: number; acc: number } | null>(null);

  // Registros recientes y total
  const [recentPasses, setRecentPasses] = useState<{ count: number; direction: string; time: string }[]>([]);
  const [totalToday, setTotalToday] = useState(0);

  // Sesión cronometrada
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  // Feedback visual al registrar (parpadeo del botón pulsado)
  const [lastPressed, setLastPressed] = useState<number | null>(null);

  // Scroll al inicio al cambiar de paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  // GPS watch cuando estamos en el paso de conteo
  useEffect(() => {
    if (step !== "conteo" || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }),
      () => setGps(null),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [step]);

  // Temporizador
  useEffect(() => {
    if (!sessionStartedAt) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStartedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartedAt]);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const startSession = trpc.countingSessions.start.useMutation({
    onSuccess: (data: any) => {
      const id = data?.insertId ?? data?.id ?? null;
      if (id) {
        setSessionId(Number(id));
        setSessionStartedAt(new Date());
        setSessionTotal(0);
        setElapsed(0);
        toast.success("Conteo iniciado");
      }
    },
    onError: (err) => toast.error("Error al iniciar conteo: " + err.message),
  });

  const finishSession = trpc.countingSessions.finish.useMutation({
    onSuccess: () => {
      toast.success(`Conteo finalizado · ${sessionTotal} personas en total`);
      setSessionId(null);
      setSessionStartedAt(null);
      setElapsed(0);
    },
    onError: (err) => toast.error("Error al finalizar conteo: " + err.message),
  });

  const addPass = trpc.passes.add.useMutation({
    onSuccess: (_data, variables) => {
      const count = variables.count;
      const direction = variables.directionLabel ?? "";
      const newPass = {
        count,
        direction,
        time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };
      setRecentPasses((prev) => [newPass, ...prev.slice(0, 9)]);
      setTotalToday((prev) => prev + count);
      setSessionTotal((prev) => prev + count);
      toast.success(`+${count} persona${count !== 1 ? "s" : ""} · ${direction}`, { duration: 1200 });
      // Limpiar feedback visual
      setTimeout(() => setLastPressed(null), 300);
    },
    onError: (err) => {
      toast.error("Error al guardar: " + err.message);
      setLastPressed(null);
    },
  });

  // ─── Registrar directamente al pulsar un botón de número ────────────────────

  const handleQuickAdd = (count: number) => {
    if (!selectedFlow) {
      toast.error("Selecciona primero un flujo (sentido)", { duration: 2000 });
      return;
    }
    if (!selectedPoint) return;
    setLastPressed(count);
    addPass.mutate({
      surveyPoint: selectedPoint.fullName,
      surveyPointCode: selectedPoint.code,
      directionLabel: selectedFlow.label,
      flowOrigin: selectedFlow.fromCode,
      flowDestination: selectedFlow.toCode,
      count,
      latitude: gps?.lat,
      longitude: gps?.lng,
      gpsAccuracy: gps?.acc,
      recordedAt: new Date(),
    });
  };

  const handleGroupConfirm = () => {
    const n = parseInt(groupCount, 10);
    if (!isNaN(n) && n > 0) {
      setGroupDialogOpen(false);
      setGroupCount("");
      handleQuickAdd(n);
    }
  };

  const handleStartSession = () => {
    if (!selectedPoint) return;
    startSession.mutate({
      surveyPointCode: selectedPoint.code,
      surveyPointName: selectedPoint.fullName,
      subPointCode: selectedSubPoint?.code ?? undefined,
      subPointName: selectedSubPoint?.fullName ?? undefined,
      latitude: gps?.lat,
      longitude: gps?.lng,
      gpsAccuracy: gps?.acc,
    });
  };

  const handleFinishSession = () => {
    if (!sessionId) return;
    finishSession.mutate({ id: sessionId, totalPersons: sessionTotal });
  };

  const handleBackToSubpunto = () => {
    setStep("subpunto");
    setSelectedSubPoint(null);
    setSelectedFlow(null);
    if (sessionId) finishSession.mutate({ id: sessionId, totalPersons: sessionTotal });
  };

  const handleBackToPunto = () => {
    setStep("punto");
    setSelectedPoint(null);
    setSelectedSubPoint(null);
    setSelectedFlow(null);
    if (sessionId) finishSession.mutate({ id: sessionId, totalPersons: sessionTotal });
  };

  // ─── PASO 1: Selección de punto principal ────────────────────────────────────

  if (step === "punto") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Conteo Peatonal</h1>
            <p className="text-sm text-gray-500">{user?.name}</p>
          </div>
        </div>
        <div className="flex-1 p-4 max-w-lg mx-auto w-full">
          <div className="mb-6 mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Selecciona el punto de conteo</h2>
            <p className="text-sm text-gray-500">Elige el punto principal donde vas a realizar el conteo</p>
          </div>
          <div className="space-y-3">
            {SURVEY_POINTS.map((point) => (
              <button
                key={point.code}
                onClick={() => { setSelectedPoint(point); setStep("subpunto"); }}
                className="w-full text-left bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl p-5 transition-all duration-150 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-blue-700 font-bold text-lg">{point.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-base">{point.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {point.subPoints.map((s) => s.name).join(" · ")}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 ml-auto transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── PASO 2: Selección de subpunto ───────────────────────────────────────────

  if (step === "subpunto" && selectedPoint) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleBackToPunto}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {selectedPoint.code} {selectedPoint.name}
            </h1>
            <p className="text-sm text-gray-500">Selecciona el subpunto</p>
          </div>
        </div>
        <div className="flex-1 p-4 max-w-lg mx-auto w-full">
          <div className="mb-6 mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">¿Desde qué subpunto?</h2>
            <p className="text-sm text-gray-500">
              Elige el subpunto. El conteo mostrará solo los flujos hacia ese subpunto en ambos sentidos.
            </p>
          </div>
          <div className="space-y-3">
            {selectedPoint.subPoints.map((sub) => (
              <button
                key={sub.code}
                onClick={() => { setSelectedSubPoint(sub); setStep("conteo"); }}
                className="w-full text-left bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl p-5 transition-all duration-150 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-indigo-700 font-bold text-sm">{sub.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-base">{sub.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {selectedPoint.fullName} ↔ {sub.fullName}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 ml-auto transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── PASO 3: Pantalla de conteo ──────────────────────────────────────────────

  const allFlows = selectedPoint ? getFlowsForPoint(selectedPoint) : [];
  const flows = selectedSubPoint
    ? allFlows.filter((f) => f.fromCode === selectedSubPoint.code || f.toCode === selectedSubPoint.code)
    : allFlows;

  const sessionActive = sessionId !== null && sessionStartedAt !== null;
  const isAdding = addPass.isPending;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ─── Header compacto ─── */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9" onClick={handleBackToSubpunto}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate leading-tight">
            {selectedPoint?.code} {selectedPoint?.name}
            {selectedSubPoint && <span className="text-gray-500 font-normal"> · {selectedSubPoint.name}</span>}
          </div>
          <div className="text-xs text-gray-400 leading-tight">
            {gps ? `GPS ±${Math.round(gps.acc)}m` : "Obteniendo GPS..."}
          </div>
        </div>
        {/* Totales */}
        <div className="flex items-center gap-3 shrink-0">
          {sessionActive && (
            <div className="text-center">
              <div className="text-base font-bold text-green-700 leading-tight">{sessionTotal}</div>
              <div className="text-xs text-gray-400 leading-tight">sesión</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-base font-bold text-blue-700 leading-tight">{totalToday}</div>
            <div className="text-xs text-gray-400 leading-tight">hoy</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">

        {/* ─── Barra de sesión ─── */}
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <div className="grid grid-cols-3 gap-2 items-center">
            <Button
              onClick={handleStartSession}
              disabled={sessionActive || startSession.isPending}
              size="sm"
              className="h-10 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:opacity-40 text-xs"
            >
              <Play className="h-3.5 w-3.5 mr-1" />
              Iniciar
            </Button>
            <div className="flex flex-col items-center justify-center">
              <div className={`flex items-center gap-1 ${sessionActive ? "text-blue-700" : "text-gray-400"}`}>
                <Timer className="h-3.5 w-3.5" />
                <span className="text-lg font-mono font-bold tabular-nums">{formatElapsed(elapsed)}</span>
              </div>
              {!sessionActive && <span className="text-xs text-gray-400">sin sesión</span>}
            </div>
            <Button
              onClick={handleFinishSession}
              disabled={!sessionActive || finishSession.isPending}
              size="sm"
              className="h-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-40 text-xs"
            >
              <Square className="h-3.5 w-3.5 mr-1" />
              Finalizar
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-4 pt-4 pb-4 gap-4">

          {/* ─── Flujos (sentido) — selección persistente ─── */}
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Flujo (sentido)
              {!selectedFlow && <span className="text-amber-500 font-bold ml-1">← selecciona uno</span>}
            </h2>
            <div className="space-y-2">
              {flows.map((flow) => (
                <button
                  key={flow.label}
                  onClick={() => setSelectedFlow(flow)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all duration-100 ${
                    selectedFlow?.label === flow.label
                      ? "bg-blue-700 border-blue-700 text-white shadow-md"
                      : "bg-white border-gray-200 text-gray-800 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {flow.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Botones de personas — registran directamente ─── */}
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Personas — toca para registrar
            </h2>

            {/* Grid +1..+8 */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
                const isActive = lastPressed === n && isAdding;
                return (
                  <button
                    key={n}
                    onClick={() => handleQuickAdd(n)}
                    disabled={isAdding}
                    className={`h-16 rounded-xl text-2xl font-bold transition-all duration-100 border-2 select-none
                      ${isActive
                        ? "bg-green-600 border-green-600 text-white scale-95 shadow-inner"
                        : selectedFlow
                          ? "bg-white border-gray-200 text-gray-800 hover:border-blue-500 hover:bg-blue-50 active:scale-95 active:bg-blue-100"
                          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    +{n}
                  </button>
                );
              })}
            </div>

            {/* Grupo grande */}
            <button
              onClick={() => {
                if (!selectedFlow) {
                  toast.error("Selecciona primero un flujo (sentido)", { duration: 2000 });
                  return;
                }
                setGroupDialogOpen(true);
                setTimeout(() => groupInputRef.current?.focus(), 100);
              }}
              disabled={isAdding}
              className={`w-full h-14 rounded-xl border-2 flex items-center justify-center gap-2 font-semibold text-base transition-all duration-100
                ${selectedFlow
                  ? "bg-white border-dashed border-amber-400 text-amber-700 hover:bg-amber-50 active:scale-95"
                  : "bg-gray-100 border-dashed border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Plus className="h-5 w-5" />
              Grupo grande (9+)
            </button>
          </div>

          {/* ─── Flujo activo + último registro ─── */}
          {selectedFlow && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <span className="font-semibold">Flujo activo:</span> {selectedFlow.label}
              </div>
              <button
                onClick={() => setSelectedFlow(null)}
                className="text-xs text-blue-500 hover:text-blue-700 underline ml-2 shrink-0"
              >
                cambiar
              </button>
            </div>
          )}

          {/* ─── Últimos registros ─── */}
          {recentPasses.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Últimos registros</h2>
              <div className="space-y-1.5">
                {recentPasses.map((p, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-lg px-4 py-2.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-bold text-blue-700 text-base shrink-0">+{p.count}</span>
                      <span className="text-gray-700 truncate">{p.direction}</span>
                    </div>
                    <span className="text-gray-400 text-xs shrink-0 ml-2">{p.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ─── Dialog grupo grande ─── */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Grupo grande</DialogTitle></DialogHeader>
          <div className="py-2">
            <p className="text-sm text-gray-600 mb-3">Introduce el número exacto de personas del grupo:</p>
            <Input
              ref={groupInputRef}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={9}
              max={999}
              value={groupCount}
              onChange={(e) => setGroupCount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGroupConfirm()}
              placeholder="Ej: 20"
              className="text-center text-2xl font-bold h-14"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setGroupDialogOpen(false); setGroupCount(""); }}>Cancelar</Button>
            <Button onClick={handleGroupConfirm} disabled={!groupCount || parseInt(groupCount) < 1}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
