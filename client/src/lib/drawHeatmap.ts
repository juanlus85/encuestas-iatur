/**
 * drawHeatmap.ts
 * Reemplaza HeatmapLayer de Google Maps (eliminado en v3.65)
 * Usa simpleheat sobre un <canvas> superpuesto al mapa de Google Maps.
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

/** Elimina el heatmap actual del mapa */
export function clearHeatmap() {
  if (overlayView) {
    overlayView.setMap(null);
    overlayView = null;
  }
  canvas = null;
  heat = null;
  currentMap = null;
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
      heat.radius(options?.radius ?? 35, options?.blur ?? 20);
      heat.max(1);

      if (options?.gradient) {
        heat.gradient(options.gradient);
      } else {
        heat.gradient({
          0.0: "rgba(0,255,0,0)",
          0.2: "rgba(0,255,0,1)",
          0.4: "rgba(128,200,0,1)",
          0.6: "rgba(220,160,0,1)",
          0.8: "rgba(255,100,0,1)",
          1.0: "rgba(255,0,0,1)",
        });
      }

      heat.draw(options?.maxOpacity ?? 0.75);
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
  google.maps.event.addListener(map, "bounds_changed", () => {
    if (overlayView) (overlayView as any).draw();
  });
}
