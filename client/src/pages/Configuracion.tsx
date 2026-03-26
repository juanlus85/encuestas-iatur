import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Edit2,
  Loader2,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const QUESTION_TYPES = [
  { value: "single_choice", label: "Opción única" },
  { value: "multiple_choice", label: "Opción múltiple" },
  { value: "yes_no", label: "Sí / No" },
  { value: "scale", label: "Escala (1-5)" },
  { value: "text", label: "Texto libre" },
  { value: "number", label: "Número" },
];

// ─── Question form ────────────────────────────────────────────────────────────

function QuestionForm({
  templateId,
  order,
  onCreated,
}: {
  templateId: number;
  order: number;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    text: "",
    textEn: "",
    type: "single_choice",
    isRequired: true,
    requiresPhoto: false,
    options: [{ value: "opt1", label: "", labelEn: "" }],
  });

  const createMutation = trpc.questions.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      onCreated();
      toast.success("Pregunta añadida");
    },
    onError: () => toast.error("Error al crear pregunta"),
  });

  const hasOptions = ["single_choice", "multiple_choice"].includes(form.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      templateId,
      order,
      text: form.text,
      textEn: form.textEn || undefined,
      type: form.type as any,
      isRequired: form.isRequired,
      requiresPhoto: form.requiresPhoto,
      options: hasOptions ? form.options.filter((o) => o.label.trim()) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Plus className="h-4 w-4 mr-1.5" />
          Añadir pregunta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva pregunta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium block mb-1.5">Texto (ES) *</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              required
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="¿Cuántos años lleva viviendo en el barrio?"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Texto (EN)</label>
            <textarea
              value={form.textEn}
              onChange={(e) => setForm({ ...form, textEn: e.target.value })}
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="How many years have you lived in the neighborhood?"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Tipo de pregunta</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {hasOptions && (
            <div>
              <label className="text-sm font-medium block mb-2">Opciones de respuesta</label>
              <div className="space-y-2">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const updated = [...form.options];
                        updated[i] = { ...updated[i], label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, "_") };
                        setForm({ ...form, options: updated });
                      }}
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={`Opción ${i + 1} (ES)`}
                    />
                    <input
                      type="text"
                      value={opt.labelEn}
                      onChange={(e) => {
                        const updated = [...form.options];
                        updated[i] = { ...updated[i], labelEn: e.target.value };
                        setForm({ ...form, options: updated });
                      }}
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={`Option ${i + 1} (EN)`}
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, options: form.options.filter((_, j) => j !== i) })}
                      className="text-destructive hover:text-destructive/80 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setForm({ ...form, options: [...form.options, { value: `opt${form.options.length + 1}`, label: "", labelEn: "" }] })}
                >
                  <Plus className="h-3 w-3 mr-1" />Añadir opción
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isRequired}
                onChange={(e) => setForm({ ...form, isRequired: e.target.checked })}
                className="rounded"
              />
              Obligatoria
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.requiresPhoto}
                onChange={(e) => setForm({ ...form, requiresPhoto: e.target.checked })}
                className="rounded"
              />
              Requiere foto
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar pregunta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({ template, onRefresh }: { template: any; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const { data: questions = [] } = trpc.questions.byTemplate.useQuery(
    { templateId: template.id },
    { enabled: expanded }
  );

  const toggleMutation = trpc.templates.update.useMutation({
    onSuccess: () => { onRefresh(); toast.success("Plantilla actualizada"); },
  });

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                template.type === "residentes" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
              }`}>
                {template.type === "residentes" ? "Residentes" : "Visitantes"}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                template.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {template.isActive ? "Activa" : "Inactiva"}
              </span>
            </div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            {template.description && (
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleMutation.mutate({ id: template.id, isActive: !template.isActive })}
              className="text-xs"
            >
              {template.isActive ? "Desactivar" : "Activar"}
            </Button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-3">
          <div className="h-px bg-border" />
          {questions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No hay preguntas. Añade la primera.</p>
          ) : (
            <div className="space-y-2">
              {questions.map((q: any, i: number) => (
                <div key={q.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground w-5 shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{q.text}</p>
                    {q.textEn && <p className="text-xs text-muted-foreground italic mt-0.5">{q.textEn}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {QUESTION_TYPES.find((t) => t.value === q.type)?.label ?? q.type}
                      </span>
                      {q.isRequired && <span className="text-xs text-red-600">Obligatoria</span>}
                      {q.requiresPhoto && <span className="text-xs text-blue-600">📷 Foto</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <QuestionForm
            templateId={template.id}
            order={questions.length + 1}
            onCreated={() => { onRefresh(); }}
          />
        </CardContent>
      )}
    </Card>
  );
}

// ─── Create template dialog ───────────────────────────────────────────────────

function CreateTemplateDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", nameEn: "", description: "", type: "visitantes" as "residentes" | "visitantes" });

  const createMutation = trpc.templates.create.useMutation({
    onSuccess: () => { setOpen(false); onCreated(); toast.success("Plantilla creada"); },
    onError: () => toast.error("Error al crear plantilla"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Nueva plantilla</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Nueva plantilla de encuesta</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium block mb-1.5">Nombre (ES) *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Encuesta a Residentes - Barrio de Santa Cruz" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Nombre (EN)</label>
            <input type="text" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Residents Survey - Santa Cruz Quarter" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Tipo</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="residentes">Residentes (muestreo estratificado)</option>
              <option value="visitantes">Visitantes (muestreo sistemático)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Descripción breve de la encuesta..." />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear plantilla"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Configuracion() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: templates = [], isLoading } = trpc.templates.list.useQuery();

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Acceso restringido a administradores.</p>
        </div>
      </DashboardLayout>
    );
  }

  const refresh = () => utils.templates.list.invalidate();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground text-sm mt-1">Gestión de plantillas y preguntas de encuesta</p>
          </div>
          <CreateTemplateDialog onCreated={refresh} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay plantillas creadas.</p>
            <p className="text-xs mt-1">Crea una plantilla para empezar a configurar las preguntas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((t) => (
              <TemplateCard key={t.id} template={t} onRefresh={refresh} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
