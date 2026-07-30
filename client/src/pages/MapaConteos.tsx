import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, PersonStanding, Thermometer, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

type ViewMode = "heatmap" | "markers";

const SURVEY_POINTS = [
  "Mateos Gago",
  "Agua",
  "Rodrigo Caro",
  "Pimienta",
  "Mesón del Moro",
];

// Centro del Barrio de Santa Cruz, Sevilla
const CENTER: [number, number] = [37.3861, -5.9915];
const ZOOM = 17;

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
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const { data: passes = [], isLoading } = trpc.passes.list.useQuery({
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    surveyPoint: surveyPoint || undefined,
  });

  const validPasses = (passes as any[]).filter(
    (p) => p.latitude != null && p.longitude != null
  );

  const totalPersonas = validPasses.reduce(
    (sum: number, p: any) => sum + (Number(p.count) ?? 1),
    0
  );

  // Inicializar el mapa Leaflet una sola vez
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // ya inicializado

    const map = L.map(mapContainerRef.current, {
      center: CENTER,
      zoom: ZOOM,
      zoomControl: true,
    });

    // Tiles de OpenStreetMap (gratuito, sin API key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      heatLayerRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Actualizar capas cuando cambian los datos o el modo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || isLoading) return;

    // Limpiar capa de calor anterior
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // Limpiar marcadores anteriores
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }

    if (validPasses.length === 0) return;

    if (mode === "heatmap") {
      // leaflet.heat: array de [lat, lng, intensity]
      // Usamos el count real como intensidad (sin normalizar)
      // y fijamos max al percentil 90 para que solo los picos reales sean rojos
      const counts = validPasses.map((p: any) => Number(p.count) || 1);
      const sorted = [...counts].sort((a, b) => a - b);
      const p90 = sorted[Math.floor(sorted.length * 0.9)] || sorted[sorted.length - 1];

      const heatData: [number, number, number][] = validPasses.map((p: any) => [
        Number(p.latitude),
        Number(p.longitude),
        Number(p.count) || 1,
      ]);

      heatLayerRef.current = (L as any).heatLayer(heatData, {
        radius: 18,        // radio más pequeño = manchas más precisas
        blur: 12,          // menos difuminado = bordes más nítidos
        maxZoom: 19,
        max: p90,          // solo el top 10% llega a rojo
        minOpacity: 0.05,
        gradient: {
          0.0: "rgba(0,128,0,0)",
          0.2: "green",
          0.5: "yellow",
          0.75: "orange",
          1.0: "red",
        },
      }).addTo(map);
    } else {
      // Marcadores con círculos proporcionales al count
      validPasses.forEach((p: any) => {
        const count = Number(p.count) || 1;
        const radius = Math.max(6, Math.min(20, 6 + Math.sqrt(count) * 1.5));
        const circle = L.circleMarker(
          [Number(p.latitude), Number(p.longitude)],
          {
            radius,
            fillColor: "#f59e0b",
            fillOpacity: 0.85,
            color: "#ffffff",
            weight: 2,
          }
        );

        circle.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 180px;">
            <p style="font-weight: 600; margin: 0 0 4px 0; font-size: 13px;">${count} persona(s)</p>
            <p style="margin: 0; font-size: 12px; color: #666;">Punto: ${p.surveyPoint ?? "—"}</p>
            <p style="margin: 2px 0; font-size: 12px; color: #666;">Sentido: ${p.directionLabel ?? "—"}</p>
            <p style="margin: 2px 0; font-size: 12px; color: #666;">Encuestador: ${p.encuestadorName ?? "—"}</p>
            <p style="margin: 2px 0; font-size: 12px; color: #666;">Fecha: ${new Date(p.recordedAt).toLocaleDateString("es-ES")}</p>
            <p style="margin: 2px 0; font-size: 12px; color: #666;">Hora: ${new Date(p.recordedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        `);

        markersLayerRef.current?.addLayer(circle);
      });
    }
  }, [isLoading, validPasses.length, mode, dateFrom, dateTo, surveyPoint]);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Mapa de Calor · Conteos Peatonales
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLoading
                ? "Cargando..."
                : `${validPasses.length} pases con GPS · ${totalPersonas.toLocaleString("es-ES")} personas`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Mode toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Visualización
                </label>
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
                <label className="text-xs font-medium text-muted-foreground">
                  Punto de conteo
                </label>
                <select
                  value={surveyPoint}
                  onChange={(e) => setSurveyPoint(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Todos los puntos</option>
                  {SURVEY_POINTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date filters */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Hasta
                </label>
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
                <p className="text-sm">
                  No hay pases con GPS para el período seleccionado.
                </p>
                <p className="text-xs mt-1">
                  Los conteos con GPS capturado aparecerán aquí.
                </p>
              </div>
            )}
            {/* El div del mapa siempre está montado para que Leaflet funcione */}
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>
        </Card>

        {/* Stats summary */}
        {!isLoading && validPasses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Pases con GPS",
                value: validPasses.length,
                color: "text-green-600",
              },
              {
                label: "Total personas",
                value: totalPersonas.toLocaleString("es-ES"),
                color: "text-amber-600",
              },
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
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
