import DashboardLayout from "@/components/DashboardLayout";
import { MapView } from "@/components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Layers, Loader2, MapPin, Thermometer } from "lucide-react";
import { useState } from "react";

type ViewMode = "markers" | "heatmap";

// ─── Legend ───────────────────────────────────────────────────────────────────

function MapLegend({ mode }: { mode: ViewMode }) {
  if (mode === "heatmap") {
    return (
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
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
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-blue-600" />
        <span>Residente</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <span>Visitante</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Mapa() {
  const [mode, setMode] = useState<ViewMode>("markers");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: locations = [], isLoading } = trpc.dashboard.gpsLocations.useQuery({
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo + "T23:59:59") : undefined,
  });

  const validLocations = (locations as any[]).filter(
    (l) => l.latitude != null && l.longitude != null
  );

  const handleMapReady = (map: google.maps.Map) => {
    // Center on Barrio de Santa Cruz, Sevilla
    const center = { lat: 37.3861, lng: -5.9915 };
    map.setCenter(center);
    map.setZoom(16);

    if (mode === "markers") {
      // Add markers
      validLocations.forEach((loc) => {
        const isResidente = loc.templateType === "residentes";
        const marker = new google.maps.Marker({
          position: { lat: Number(loc.latitude), lng: Number(loc.longitude) },
          map,
          title: `#${loc.id} - ${loc.encuestadorName ?? "Encuestador"} (${new Date(loc.startedAt).toLocaleDateString("es-ES")})`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: isResidente ? "#1e4d8c" : "#d97706",
            fillOpacity: 0.85,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 180px;">
              <p style="font-weight: 600; margin: 0 0 4px 0; font-size: 13px;">Encuesta #${loc.id}</p>
              <p style="margin: 0; font-size: 12px; color: #666;">Encuestador: ${loc.encuestadorName ?? "—"}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">Tipo: ${isResidente ? "Residente" : "Visitante"}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">Fecha: ${new Date(loc.startedAt).toLocaleDateString("es-ES")}</p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">Hora: ${new Date(loc.startedAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</p>
              ${loc.surveyPoint ? `<p style="margin: 2px 0; font-size: 12px; color: #666;">Punto: ${loc.surveyPoint}</p>` : ""}
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    } else {
      // Heatmap
      const heatmapData = validLocations.map((loc) =>
        new google.maps.LatLng(Number(loc.latitude), Number(loc.longitude))
      );

      const heatmap = new (google.maps as any).visualization.HeatmapLayer({
        data: heatmapData,
        map,
        radius: 25,
        opacity: 0.7,
        gradient: [
          "rgba(0, 255, 255, 0)",
          "rgba(0, 255, 255, 1)",
          "rgba(0, 191, 255, 1)",
          "rgba(0, 127, 255, 1)",
          "rgba(0, 63, 255, 1)",
          "rgba(0, 0, 255, 1)",
          "rgba(0, 0, 223, 1)",
          "rgba(0, 0, 191, 1)",
          "rgba(0, 0, 159, 1)",
          "rgba(0, 0, 127, 1)",
          "rgba(63, 0, 91, 1)",
          "rgba(127, 0, 63, 1)",
          "rgba(191, 0, 31, 1)",
          "rgba(255, 0, 0, 1)",
        ],
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mapa de Campo</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {validLocations.length} ubicaciones GPS registradas
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
                </div>
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

              <div className="ml-auto">
                <MapLegend mode={mode} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-[520px] md:h-[620px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : validLocations.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">No hay ubicaciones GPS registradas para el período seleccionado.</p>
                <p className="text-xs mt-1">Las encuestas con GPS capturado aparecerán aquí.</p>
              </div>
            ) : (
              <MapView
                key={`${mode}-${dateFrom}-${dateTo}`}
                onMapReady={handleMapReady}
                className="w-full h-full"
              />
            )}
          </div>
        </Card>

        {/* Stats summary */}
        {validLocations.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Con GPS", value: validLocations.length, color: "text-green-600" },
              {
                label: "Residentes",
                value: validLocations.filter((l: any) => l.templateType === "residentes").length,
                color: "text-blue-600",
              },
              {
                label: "Visitantes",
                value: validLocations.filter((l: any) => l.templateType !== "residentes").length,
                color: "text-amber-600",
              },
              {
                label: "Encuestadores",
                value: new Set(validLocations.map((l: any) => l.encuestadorId)).size,
                color: "text-primary",
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
