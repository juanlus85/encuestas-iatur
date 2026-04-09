import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Answer = { questionId: number; answer: any };
type GpsState = { lat: number; lng: number; accuracy: number } | null;
type PhotoData = { base64: string; preview: string; questionId?: number };

interface QuestionOption { value: string; label: string; labelEn?: string }
interface Question {
  id: number;
  type: string;
  text: string;
  textEn?: string | null;
  options?: unknown;
  isRequired: boolean;
  requiresPhoto: boolean;
}

// ─── GPS Hook ─────────────────────────────────────────────────────────────────

function useGPS() {
  const [gps, setGps] = useState<GpsState>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const acquire = useCallback(() => {
    if (!navigator.geolocation) { setGpsStatus("error"); return; }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setGpsStatus("ok");
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => { acquire(); }, [acquire]);

  return { gps, gpsStatus, retryGps: acquire };
}

// ─── Photo Capture ────────────────────────────────────────────────────────────

function PhotoCapture({ onCapture, photos }: { onCapture: (data: PhotoData) => void; photos: PhotoData[] }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64Full = ev.target?.result as string;
      const base64 = base64Full.split(",")[1];
      onCapture({ base64, preview: base64Full });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 border-dashed border-2"
        onClick={() => inputRef.current?.click()}
      >
        <Camera className="h-4 w-4 mr-2" />
        Tomar fotografía
      </Button>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
              <img src={p.preview} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Question Renderer ────────────────────────────────────────────────────────

function QuestionRenderer({
  question,
  lang,
  answer,
  onAnswer,
  photos,
  onPhoto,
}: {
  question: Question;
  lang: "es" | "en";
  answer: any;
  onAnswer: (val: any) => void;
  photos: PhotoData[];
  onPhoto: (data: PhotoData) => void;
}) {
  const text = lang === "en" && question.textEn ? question.textEn : question.text;
  const opts = question.options as QuestionOption[] | null | undefined ?? null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-lg font-semibold text-foreground leading-snug">{text}</p>
        {question.isRequired && (
          <span className="text-xs text-destructive font-medium mt-1 inline-block">* Obligatorio</span>
        )}
      </div>

      {/* Single choice */}
      {question.type === "single_choice" && opts && (
        <div className="space-y-2">
          {opts.map((opt) => {
            const label = lang === "en" && opt.labelEn ? opt.labelEn : opt.label;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onAnswer(opt.value)}
                className={`survey-option-btn ${answer === opt.value ? "selected" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                    answer === opt.value ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {answer === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Yes/No */}
      {question.type === "yes_no" && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: "si", label: lang === "en" ? "Yes" : "Sí" },
            { val: "no", label: "No" },
          ].map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => onAnswer(val)}
              className={`py-4 rounded-xl border-2 font-semibold text-base transition-all ${
                answer === val
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Scale */}
      {question.type === "scale" && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onAnswer(n)}
                className={`py-4 rounded-xl border-2 font-bold text-lg transition-all ${
                  answer === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>{lang === "en" ? "Very bad" : "Muy malo"}</span>
            <span>{lang === "en" ? "Excellent" : "Excelente"}</span>
          </div>
        </div>
      )}

      {/* Number */}
      {question.type === "number" && (
        <input
          type="number"
          value={answer ?? ""}
          onChange={(e) => onAnswer(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          placeholder="Introduzca un número..."
        />
      )}

      {/* Text */}
      {question.type === "text" && (
        <textarea
          value={answer ?? ""}
          onChange={(e) => onAnswer(e.target.value)}
          rows={4}
          className="w-full border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
          placeholder={lang === "en" ? "Enter your answer..." : "Escriba su respuesta..."}
        />
      )}

      {/* Multiple choice */}
      {question.type === "multiple_choice" && opts && (
        <div className="space-y-2">
          {opts.map((opt) => {
            const label = lang === "en" && opt.labelEn ? opt.labelEn : opt.label;
            const selected = Array.isArray(answer) && answer.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const current = Array.isArray(answer) ? answer : [];
                  onAnswer(selected ? current.filter((v: string) => v !== opt.value) : [...current, opt.value]);
                }}
                className={`survey-option-btn ${selected ? "selected" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                    selected ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {selected && <div className="w-2 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] mt-[-1px]" />}
                  </div>
                  <span className="text-sm">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Photo */}
      {question.requiresPhoto && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            {lang === "en" ? "Required photo" : "Fotografía requerida"}
          </p>
          <PhotoCapture
            onCapture={(d) => onPhoto({ ...d, questionId: question.id })}
            photos={photos.filter((p) => p.questionId === question.id)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Survey Form ─────────────────────────────────────────────────────────

export default function SurveyForm() {
  const { id } = useParams<{ id: string }>();
  const templateId = parseInt(id ?? "0");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: templateData, isLoading } = trpc.templates.byId.useQuery({ id: templateId });
  const submitMutation = trpc.responses.submit.useMutation();
  const uploadPhotoMutation = trpc.photos.upload.useMutation();

  const { gps, gpsStatus, retryGps } = useGPS();
  const [lang, setLang] = useState<"es" | "en">("es");
  const [currentStep, setCurrentStep] = useState(0); // 0 = metadata, 1..n = questions
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [surveyPoint, setSurveyPoint] = useState("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [windowCode, setWindowCode] = useState<string>(""); // V1/V2/V3 para visitantes
  const [startMinute, setStartMinute] = useState<string>("");
  const [endMinute, setEndMinute] = useState<string>("");
  const [surveyCode, setSurveyCode] = useState<string>("");
  const [startedAt] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  const isVisitantes = templateData?.type === "visitantes";

  const questions = templateData?.questions ?? [];
  const totalSteps = questions.length;

  const getAnswer = (qId: number) => answers.find((a) => a.questionId === qId)?.answer;
  const setAnswer = (qId: number, val: any) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === qId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId: qId, answer: val };
        return updated;
      }
      return [...prev, { questionId: qId, answer: val }];
    });
  };

  const currentQuestion = currentStep > 0 ? questions[currentStep - 1] : null;
  const isLastStep = currentStep === totalSteps;

  // Scroll al inicio al cambiar de paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const canProceed = () => {
    if (currentStep === 0) return true;
    if (!currentQuestion) return true;
    if (!currentQuestion.isRequired) return true;
    const ans = getAnswer(currentQuestion.id);
    if (ans === undefined || ans === null || ans === "") return false;
    if (Array.isArray(ans) && ans.length === 0) return false;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await submitMutation.mutateAsync({
        templateId,
        surveyPoint: surveyPoint || undefined,
        timeSlot: timeSlot as any || undefined,
        latitude: gps?.lat,
        longitude: gps?.lng,
        gpsAccuracy: gps?.accuracy,
        startedAt,
        finishedAt: new Date(),
        language: lang,
        answers,
        status: "completa",
        deviceInfo: navigator.userAgent.substring(0, 200),
        // Metadatos específicos de visitantes
        ...(isVisitantes && {
          windowCode: windowCode || undefined,
          startMinute: startMinute ? parseInt(startMinute) : undefined,
          endMinute: endMinute ? parseInt(endMinute) : undefined,
          surveyCode: surveyCode || undefined,
        }),
      });

      const responseId = result.id as number;
      setSubmittedId(responseId);

      // Upload photos
      for (const photo of photos) {
        await uploadPhotoMutation.mutateAsync({
          responseId,
          questionId: photo.questionId,
          base64: photo.base64,
          mimeType: "image/jpeg",
          sizeBytes: Math.round(photo.base64.length * 0.75),
        });
      }

      setSubmitted(true);
    } catch (e) {
      toast.error("Error al enviar la encuesta. Inténtelo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">¡Encuesta enviada!</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Referencia #{submittedId} · {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <Button onClick={() => setLocation("/")} className="w-full" size="lg">
            Nueva encuesta
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!templateData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Encuesta no encontrada.</p>
          <Button onClick={() => setLocation("/")} variant="outline" className="mt-4">Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold leading-tight">
              {lang === "en" && templateData.nameEn ? templateData.nameEn : templateData.name}
            </p>
            <p className="text-xs text-primary-foreground/70">
              {currentStep === 0 ? "Datos de campo" : `Pregunta ${currentStep} de ${totalSteps}`}
            </p>
          </div>
          <button
            onClick={() => setLang(lang === "es" ? "en" : "es")}
            className="flex items-center gap-1 text-xs text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            {lang.toUpperCase()}
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-primary-foreground/20">
          <div
            className="h-full bg-primary-foreground transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">

        {/* Step 0: Metadata */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Datos de campo</h2>
              <p className="text-sm text-muted-foreground mt-1">Complete la información antes de iniciar la encuesta.</p>
            </div>

            {/* GPS status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${
              gpsStatus === "ok" ? "bg-green-50 border-green-200" :
              gpsStatus === "error" ? "bg-red-50 border-red-200" :
              "bg-muted border-border"
            }`}>
              <MapPin className={`h-5 w-5 shrink-0 ${
                gpsStatus === "ok" ? "text-green-600" :
                gpsStatus === "error" ? "text-red-600" : "text-muted-foreground"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {gpsStatus === "ok" ? "Ubicación capturada" :
                   gpsStatus === "loading" ? "Obteniendo ubicación..." :
                   gpsStatus === "error" ? "Ubicación no disponible" : "GPS inactivo"}
                </p>
                {gpsStatus === "ok" && gps && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)} · ±{Math.round(gps.accuracy)}m
                  </p>
                )}
              </div>
              {gpsStatus === "error" && (
                <button onClick={retryGps} className="text-xs text-red-600 font-medium underline shrink-0">Reintentar</button>
              )}
              {gpsStatus === "loading" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
            </div>

            {/* Survey point */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Punto de encuesta {isVisitantes && <span className="text-destructive">*</span>}
              </label>
              <select
                value={surveyPoint}
                onChange={(e) => setSurveyPoint(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Seleccionar punto...</option>
                {/* Puntos definitivos del proyecto IATUR - Santa Cruz 2026 */}
                <option value="01 Virgen de los Reyes">01 Virgen de los Reyes</option>
                <option value="02 Mateos Gago">02 Mateos Gago</option>
                <option value="03 Patio de Banderas">03 Patio de Banderas</option>
                <option value="04 Agua / Vida">04 Agua / Vida</option>
                <option value="05 Plaza Alfaro">05 Plaza Alfaro</option>
                {!isVisitantes && <option value="Otro">Otro</option>}
              </select>
            </div>

            {/* Time slot */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Bloque horario (90 min) {isVisitantes && <span className="text-destructive">*</span>}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(isVisitantes
                  ? [
                      { val: "manana", label: "Mañana (10–12)" },
                      { val: "mediodia", label: "Mediodía (12–15)" },
                      { val: "tarde", label: "Tarde (17–20)" },
                      { val: "noche", label: "Noche (20–23)" },
                    ]
                  : [
                      { val: "manana", label: "Mañana (8–14h)" },
                      { val: "tarde", label: "Tarde (14–20h)" },
                      { val: "noche", label: "Noche (20–24h)" },
                      { val: "fin_semana", label: "Fin de semana" },
                    ]
                ).map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTimeSlot(val)}
                    className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      timeSlot === val
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campos exclusivos de visitantes */}
            {isVisitantes && (
              <>
                {/* Código de ventana */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Código de ventana (tramo 30 min) <span className="text-destructive">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "V1", label: "V1 (0–30 min)" },
                      { val: "V2", label: "V2 (30–60 min)" },
                      { val: "V3", label: "V3 (60–90 min)" },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setWindowCode(val)}
                        className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          windowCode === val
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutos inicio/fin */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Minuto de inicio</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                      placeholder="0–90"
                      className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Minuto de fin</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                      placeholder="0–90"
                      className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Código de cuestionario */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Código de cuestionario</label>
                  <input
                    type="text"
                    value={surveyCode}
                    onChange={(e) => setSurveyCode(e.target.value)}
                    placeholder="Ej: V-001"
                    className="w-full border border-border rounded-lg px-4 py-3 text-base bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            {/* Time info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Inicio: {startedAt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
        )}

        {/* Steps 1..n: Questions */}
        {currentStep > 0 && currentQuestion && (
          <div className="space-y-5">
            <QuestionRenderer
              question={currentQuestion}
              lang={lang}
              answer={getAnswer(currentQuestion.id)}
              onAnswer={(val) => setAnswer(currentQuestion.id, val)}
              photos={photos.filter((p) => p.questionId === currentQuestion.id)}
              onPhoto={(d) => setPhotos((prev) => [...prev, d])}
            />
            {/* Navigation buttons — right below the question */}
            <div className="flex gap-3 pt-2">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="flex-1"
                  disabled={submitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="flex-1"
                  disabled={!canProceed()}
                  size="lg"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={submitting}
                  size="lg"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4 mr-2" />Enviar encuesta</>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Last step: Summary + extra photos */}
        {currentStep === totalSteps && totalSteps > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Resumen y envío</h2>
              <p className="text-sm text-muted-foreground mt-1">Revise y añada fotografías adicionales antes de enviar.</p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Encuestador</span>
                <span className="font-medium">{user?.name} {user?.identifier ? `(${user.identifier})` : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Punto</span>
                <span className="font-medium">{surveyPoint || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Franja</span>
                <span className="font-medium">{timeSlot || "—"}</span>
              </div>
              {isVisitantes && windowCode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ventana</span>
                  <span className="font-medium">{windowCode}</span>
                </div>
              )}
              {isVisitantes && surveyCode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cód. cuestionario</span>
                  <span className="font-medium">{surveyCode}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">GPS</span>
                <span className={`font-medium ${gpsStatus === "ok" ? "text-green-600" : "text-amber-600"}`}>
                  {gpsStatus === "ok" ? "Capturado" : "No disponible"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Respuestas</span>
                <span className="font-medium">{answers.length} / {totalSteps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fotos</span>
                <span className="font-medium">{photos.length}</span>
              </div>
            </div>

            {/* Extra photos */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Fotografías adicionales</p>
              <PhotoCapture
                onCapture={(d) => setPhotos((prev) => [...prev, d])}
                photos={photos.filter((p) => !p.questionId)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Step 0 navigation: Iniciar encuesta */}
      {currentStep === 0 && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-6">
          <Button
            onClick={() => setCurrentStep(1)}
            className="w-full"
            size="lg"
            disabled={!canProceed()}
          >
            Iniciar encuesta
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      {/* Last step navigation: Enviar */}
      {currentStep === totalSteps && totalSteps > 0 && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex-1"
              disabled={submitting}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={submitting}
              size="lg"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
              ) : (
                <><CheckCircle2 className="h-4 w-4 mr-2" />Enviar encuesta</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
