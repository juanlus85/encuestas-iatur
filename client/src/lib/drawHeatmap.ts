/**
 * drawHeatmap.ts
 * Reemplaza HeatmapLayer de Google Maps (eliminado en v3.65)
 * Usa simpleheat sobre un <canvas> superpuesto al mapa de Google Maps.
 *
 * La escala de color refleja el PESO de cada punto (no densidad acumulada):
 *   verde → peso bajo (pocas personas / pocas encuestas)
 *   amarillo → peso medio
 *   rojo → peso alto (muchas personas / muchas encuestas)
 *
 * Para que el gradiente funcione correctamente, los pesos deben pasarse
 * en su valor real (no normalizados a 0-1). drawHeatmap calcula el max
 * automáticamente como el máximo de los pesos recibidos.
 */
import simpleheat from "simpleheat";

export interface HeatPoint {
  lat: number;
  lng: number;
  weight?: number; // valor real, ej: número de personas o 1 por encuesta
}

let canvas: HTMLCanvasElement | null = null;
let heat: ReturnType<typeof simpleheat> | null = null;
let currentMap: google.maps.Map | null = null;
let overlayView: google.maps.OverlayView | null = null;
let boundsListener: google.maps.MapsEventListener | null = null;
let currentPoints: HeatPoint[] = [];
let currentOptions: Parameters<typeof drawHeatmap>[2] = {};

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
  currentPoints = [];
}

/**
 * Dibuja un heatmap sobre un mapa de Google Maps usando simpleheat.
 * Los pesos se pasan en valor real; el max se calcula como el máximo absoluto.
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
  currentPoints = points;
  currentOptions = options;

  // Calcular el peso máximo para normalizar la escala
  const maxWeight = Math.max(...points.map((p) => p.weight ?? 1));

  const radius = options?.radius ?? 18;
  const blur = options?.blur ?? 12;

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

      const heatData: [number, number, number][] = currentPoints
        .map((p) => {
          const pixel = projection.fromLatLngToDivPixel(
            new google.maps.LatLng(p.lat, p.lng)
          );
          if (!pixel) return null;
          const x = pixel.x - Math.min(sw.x, ne.x);
          const y = pixel.y - Math.min(ne.y, sw.y);
          // Pasar el peso real (no normalizado); simpleheat lo compara contra max
          return [x, y, p.weight ?? 1] as [number, number, number];
        })
        .filter(Boolean) as [number, number, number][];

      if (!heatData.length) return;

      heat = simpleheat(canvas);
      heat.data(heatData);
      heat.radius(radius, blur);
      // max = peso máximo absoluto → el punto más "pesado" será rojo,
      // los demás tendrán el color proporcional a su peso
      heat.max(maxWeight);

      if (options?.gradient) {
        heat.gradient(options.gradient);
      } else {
        heat.gradient({
          0.0: "rgba(0,200,0,0)",
          0.2: "rgba(0,200,0,0.55)",
          0.4: "rgba(100,210,0,0.7)",
          0.55: "rgba(200,210,0,0.8)",
          0.7: "rgba(255,160,0,0.88)",
          0.85: "rgba(255,80,0,0.95)",
          1.0: "rgba(255,0,0,1)",
        });
      }

      heat.draw(options?.maxOpacity ?? 0.72);
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

  boundsListener = google.maps.event.addListener(map, "bounds_changed", () => {
    if (overlayView) (overlayView as any).draw();
  });
}
