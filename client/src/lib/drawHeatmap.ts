/**
 * drawHeatmap.ts
 * Reemplaza HeatmapLayer de Google Maps (eliminado en v3.65)
 * Usa simpleheat sobre un <canvas> superpuesto al mapa de Google Maps.
 *
 * La escala de color refleja densidad real:
 *   verde → pocos puntos cercanos
 *   amarillo → densidad media
 *   rojo → alta concentración
 */
import simpleheat from "simpleheat";

export interface HeatPoint {
  lat: number;
  lng: number;
  weight?: number; // 0-1, por defecto 1
}

let canvas: HTMLCanvasElement | null = null;
let heat: ReturnType<typeof simpleheat> | null = null;
let currentMap: google.maps.Map | null = null;
let overlayView: google.maps.OverlayView | null = null;
let boundsListener: google.maps.MapsEventListener | null = null;

/** Elimina el heatmap actual del mapa */
export function clearHeatmap() {
  if (boundsListener) {
    google.maps.event.removeListener(boundsListener);
    boundsListener = null;
  }
  if (overlayView) {
    overlayView.setMap(null);
    overlayView = null;
  }
  canvas = null;
  heat = null;
  currentMap = null;
}

/**
 * Calcula el valor "max" para simpleheat basándose en la densidad real de los puntos.
 * Agrupa los puntos en celdas de ~30px y cuenta cuántos caen en cada celda.
 * El max se fija en el percentil 90 de densidad (no en el absoluto), para que
 * zonas con pocos puntos aparezcan verdes aunque haya una zona muy densa.
 */
function computeMax(
  heatData: [number, number, number][],
  radius: number
): number {
  if (!heatData.length) return 1;

  // Agrupar en celdas del tamaño del radio
  const cellSize = radius;
  const cells: Record<string, number> = {};
  for (const [x, y, w] of heatData) {
    const cx = Math.floor(x / cellSize);
    const cy = Math.floor(y / cellSize);
    const key = `${cx},${cy}`;
    cells[key] = (cells[key] ?? 0) + w;
  }

  const values = Object.values(cells).sort((a, b) => a - b);
  if (!values.length) return 1;

  // Percentil 85: el 15% más denso será rojo, el resto tendrá gradiente
  const p85idx = Math.floor(values.length * 0.85);
  const p85 = values[Math.min(p85idx, values.length - 1)];
  return Math.max(1, p85);
}

/**
 * Dibuja un heatmap sobre un mapa de Google Maps usando simpleheat.
 * Llama a clearHeatmap() antes de dibujar uno nuevo si cambias los datos.
 */
export function drawHeatmap(
  map: google.maps.Map,
  points: HeatPoint[],
  options?: {
    radius?: number;
    blur?: number;
    maxOpacity?: number;
    gradient?: Record<string, string>;
  }
) {
  clearHeatmap();
  if (!points.length) return;

  currentMap = map;
  const radius = options?.radius ?? 20;
  const blur = options?.blur ?? 15;

  class HeatOverlay extends google.maps.OverlayView {
    onAdd() {
      const panes = this.getPanes();
      if (!panes) return;
      canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      panes.overlayLayer.appendChild(canvas);
    }

    draw() {
      if (!canvas || !currentMap) return;
      const projection = this.getProjection();
      if (!projection) return;

      const bounds = currentMap.getBounds();
      if (!bounds) return;

      // Calcular tamaño del canvas según los bounds del mapa
      const sw = projection.fromLatLngToDivPixel(bounds.getSouthWest())!;
      const ne = projection.fromLatLngToDivPixel(bounds.getNorthEast())!;

      const width = Math.abs(ne.x - sw.x);
      const height = Math.abs(sw.y - ne.y);

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.style.left = Math.min(sw.x, ne.x) + "px";
      canvas.style.top = Math.min(ne.y, sw.y) + "px";

      // Convertir lat/lng a coordenadas de pixel relativas al canvas
      const heatData: [number, number, number][] = points
        .map((p) => {
          const pixel = projection.fromLatLngToDivPixel(
            new google.maps.LatLng(p.lat, p.lng)
          );
          if (!pixel) return null;
          const x = pixel.x - Math.min(sw.x, ne.x);
          const y = pixel.y - Math.min(ne.y, sw.y);
          return [x, y, p.weight ?? 1] as [number, number, number];
        })
        .filter(Boolean) as [number, number, number][];

      if (!heatData.length) return;

      heat = simpleheat(canvas);
      heat.data(heatData);
      heat.radius(radius, blur);

      // Calcular max dinámico basado en densidad real (percentil 85)
      const maxVal = computeMax(heatData, radius);
      heat.max(maxVal);

      if (options?.gradient) {
        heat.gradient(options.gradient);
      } else {
        // Verde → amarillo → naranja → rojo según densidad
        heat.gradient({
          0.0: "rgba(0,255,0,0)",
          0.25: "rgba(0,200,0,0.6)",
          0.45: "rgba(100,220,0,0.75)",
          0.6: "rgba(220,200,0,0.85)",
          0.75: "rgba(255,140,0,0.9)",
          0.9: "rgba(255,60,0,1)",
          1.0: "rgba(255,0,0,1)",
        });
      }

      heat.draw(options?.maxOpacity ?? 0.7);
    }

    onRemove() {
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
        canvas = null;
      }
    }
  }

  overlayView = new HeatOverlay();
  overlayView.setMap(map);

  // Redibujar cuando el mapa cambia (zoom/pan)
  boundsListener = google.maps.event.addListener(map, "bounds_changed", () => {
    if (overlayView) (overlayView as any).draw();
  });
}
