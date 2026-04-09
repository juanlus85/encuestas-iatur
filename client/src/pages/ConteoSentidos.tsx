import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeftRight } from "lucide-react";
import { SURVEY_POINTS, getFlowsForPoint } from "../../../shared/surveyPoints";

export default function ConteoSentidos() {
  const [selectedCode, setSelectedCode] = useState<string>(SURVEY_POINTS[0].code);
  const selectedPoint = SURVEY_POINTS.find((p) => p.code === selectedCode)!;
  const flows = getFlowsForPoint(selectedPoint);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Puntos y Flujos de Conteo</h1>
          <p className="text-gray-500 mt-1">
            Estructura definitiva de puntos, subpuntos y flujos bidireccionales del proyecto IATUR.
          </p>
        </div>

        {/* Selector de punto */}
        <div className="flex flex-wrap gap-2">
          {SURVEY_POINTS.map((p) => (
            <button
              key={p.code}
              onClick={() => setSelectedCode(p.code)}
              className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                selectedCode === p.code
                  ? "bg-blue-700 border-blue-700 text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-400"
              }`}
            >
              {p.code} {p.name}
            </button>
          ))}
        </div>

        {/* Punto seleccionado */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <div className="text-lg">{selectedPoint.fullName}</div>
                <div className="text-sm font-normal text-gray-500">
                  {selectedPoint.subPoints.length} subpuntos · {flows.length} flujos bidireccionales
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subpuntos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Subpuntos</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPoint.subPoints.map((sub) => (
                  <Badge key={sub.code} variant="secondary" className="text-sm px-3 py-1">
                    {sub.fullName}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Flujos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" /> Flujos bidireccionales
              </h3>
              <div className="space-y-2">
                {flows.map((flow, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-800 flex items-center gap-2"
                  >
                    <span className="text-blue-600 font-bold shrink-0">{i % 2 === 0 ? "→" : "←"}</span>
                    {flow.label}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen global */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumen global de todos los puntos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Punto</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-600">Subpuntos</th>
                    <th className="text-left py-2 font-semibold text-gray-600">Flujos</th>
                  </tr>
                </thead>
                <tbody>
                  {SURVEY_POINTS.map((p) => {
                    const f = getFlowsForPoint(p);
                    return (
                      <tr key={p.code} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 pr-4 font-medium">{p.fullName}</td>
                        <td className="py-2 pr-4 text-gray-600">
                          {p.subPoints.map((s) => s.fullName).join(", ")}
                        </td>
                        <td className="py-2 text-gray-600">{f.length} flujos</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
