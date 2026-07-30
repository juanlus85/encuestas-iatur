import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, PersonStanding, Thermometer, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ViewMode = "heatmap" | "markers";

const SURVEY_POINTS = [
  "Mateos Gago",
  "Agua",
  "Rodrigo Caro",
  "Pimienta",
  "Mesón del Moro",
];

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  "AIzaSyDMho7U8Eb1RJHc3xKNFEAETvcUBEpCCq8";

// Carga el script de Google Maps con v=3.58 (última versión estable con HeatmapLayer)
let mapScriptPromise: Promise<void> | null = null;
function loadMapScript(): Promise<void> {
  if (mapScriptPromise) return mapScriptPromise;
  if (typeof window !== "undefined" && (window as any).google?.maps?.visualization) {
    return Promise.resolve();
  }
  mapScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=3.58&libraries=marker,places,geocoding,geometry,visualization`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      mapScriptPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(script);
  });
  return mapScriptPromise;
}

function HeatmapLegend() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span>Baja densidad</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <span>Media</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span>Alta densidad</span>
      </div>
      <span className="text-muted-foreground/60">· peso proporcional al nº de personas</span>
    </div>
  );
}

export default function MapaConteos() {
  const [mode, setMode] = useState<ViewMode>("heatmap");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [surveyPoint, setSurveyPoint] = useState("");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const heatmapLayerRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const { data: passes = [], isLoading } = trpc.passes.list.useQuery({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    surveyPoint: surveyPoint || undefined,
  });

  const validPasses = (passes as any[]).filter(
    (p) => p.latitude != null && p.longitude != null
  );

  const totalPersonas = validPasses.reduce((sum: number, p: any) => sum + (Number(p.count) ?? 1), 0);

  // Inicializar el mapa una sola vez
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let cancelled = false;

    loadMapScript()
      .then(() => {
        if (cancelled || !mapContainerRef.current) return;
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
            zoom: 17,
            center: { lat: 37.3861, lng: -5.9915 },
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
            streetViewControl: false,
            mapId: "DEMO_MAP_ID",
          });
        }
        setMapReady(true);
      })
      .catch((err) => {
        if (!cancelled) setMapError("No se pudo cargar el mapa. Comprueba la conexión.");
        console.error(err);
      });

    return () => { cancelled = true; };
  }, []);

  // Actualizar capas cuando cambian los datos o el modo
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || isLoading) return;

    const map = mapInstanceRef.current;

    // Limpiar capa de calor anterior
    if (heatmapLayerRef.current) {
      heatmapLayerRef.current.setMap(null);
      heatmapLayerRef.current = null;
    }

    // Limpiar marcadores anteriores
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (validPasses.length === 0) return;

    if (mode === "heatmap") {
      // Usar HeatmapLayer nativo de Google Maps (disponible en v=3.58)
      const heatData = validPasses.map((p: any) => ({
        location: new google.maps.LatLng(Number(p.latitude), Number(p.longitude)),
        weight: Math.max(1, Number(p.count) ?? 1),
      }));

      heatmapLayerRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatData,
        map,
        radius: 25,
        opacity: 0.8,
        gradient: [
          "rgba(0, 255, 0, 0)",
          "rgba(0, 255, 0, 1)",
          "rgba(255, 255, 0, 1)",
          "rgba(255, 165, 0, 1)",
          "rgba(255, 0, 0, 1)",
        ],
      });
    } else {
      // Marcadores con tamaño proporcional al count
      validPasses.forEach((p: any) => {
        const scale = Math.max(8, Math.min(24, 8 + Math.sqrt(Number(p.count) ?? 1) * 2));
        const marker = new window.google.maps.Marker({
          position: { lat: Number(p.latitude), lng: Number(p.longitude) },
          map,
          title: `${p.count} persona(s) · ${p.directionLabel ?? "Sin sentido"}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale,
            fillColor: "#f59e0b",
            fillOpacity: 0.85,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 180px;">
              <p style="font-weight: 600; margin: 0 0 4px 0; font-size: 13px;">${p.count} persona(s)</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Punto: ${p.surveyPoint}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">Sentido: ${p.directionLabel ?? "—"}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">Encuestador: ${p.encuestadorName ?? "—"}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">Fecha: ${new Date(p.recordedAt).toLocaleDateString("es-ES")}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">Hora: ${new Date(p.recordedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          `,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        markersRef.current.push(marker);
      });
    }
  }, [mapReady, isLoading, validPasses.length, mode, dateFrom, dateTo, surveyPoint]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mapa de Calor · Conteos Peatonales</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLoading ? "Cargando..." : `${validPasses.length} pases con GPS · ${totalPersonas.toLocaleString("es-ES")} personas`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Mode toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Visualización</label>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => setMode("heatmap")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                      mode === "heatmap"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    <Thermometer className="h-4 w-4" />
                    Mapa de calor
                  </button>
                  <button
                    onClick={() => setMode("markers")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                      mode === "markers"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    Marcadores
                  </button>
                </div>
              </div>

              {/* Punto filter */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Punto de conteo</label>
                <select
                  value={surveyPoint}
                  onChange={(e) => setSurveyPoint(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todos los puntos</option>
                  {SURVEY_POINTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Date filters */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Desde</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Hasta</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {mode === "heatmap" && (
                <div className="ml-auto">
                  <HeatmapLegend />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-[520px] md:h-[620px] relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!isLoading && validPasses.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground z-10">
                <PersonStanding className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">No hay pases con GPS para el período seleccionado.</p>
                <p className="text-xs mt-1">Los conteos con GPS capturado aparecerán aquí.</p>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center text-destructive z-10">
                <p className="text-sm">{mapError}</p>
              </div>
            )}
            {/* El div del mapa siempre está montado para que el ref funcione */}
            <div
              ref={mapContainerRef}
              className="w-full h-full"
            />
          </div>
        </Card>

        {/* Stats summary */}
        {!isLoading && validPasses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Pases con GPS", value: validPasses.length, color: "text-green-600" },
              { label: "Total personas", value: totalPersonas.toLocaleString("es-ES"), color: "text-amber-600" },
              {
                label: "Media por pase",
                value: (totalPersonas / validPasses.length).toFixed(1),
                color: "text-primary",
              },
              {
                label: "Puntos activos",
                value: new Set(validPasses.map((p: any) => p.surveyPoint)).size,
                color: "text-blue-600",
              },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
