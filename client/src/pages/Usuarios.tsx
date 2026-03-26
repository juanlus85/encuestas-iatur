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
import { nanoid } from "nanoid";
import { Loader2, Plus, Shield, User, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  encuestador: "Encuestador",
  revisor: "Revisor",
  user: "Usuario",
};

const ROLE_ICONS: Record<string, any> = {
  admin: Shield,
  encuestador: UserCheck,
  revisor: User,
  user: User,
};

function UserCard({ user, onUpdate }: { user: any; onUpdate: () => void }) {
  const updateMutation = trpc.users.update.useMutation({
    onSuccess: () => { onUpdate(); toast.success("Usuario actualizado"); },
    onError: () => toast.error("Error al actualizar"),
  });

  const Icon = ROLE_ICONS[user.role] ?? User;

  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground text-sm">{user.name || "Sin nombre"}</p>
          {user.identifier && (
            <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{user.identifier}</span>
          )}
          {!user.isActive && (
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Inactivo</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{ROLE_LABELS[user.role] ?? user.role}</p>
        {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateMutation.mutate({ id: user.id, isActive: !user.isActive })}
          disabled={updateMutation.isPending}
          className="text-xs"
        >
          {user.isActive ? "Desactivar" : "Activar"}
        </Button>
      </div>
    </div>
  );
}

function CreateUserDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "encuestador" as "admin" | "encuestador" | "revisor",
    identifier: "",
    openId: "",
  });

  const createMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      setForm({ name: "", email: "", role: "encuestador", identifier: "", openId: "" });
      onCreated();
      toast.success("Usuario creado correctamente");
    },
    onError: () => toast.error("Error al crear usuario"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    createMutation.mutate({
      ...form,
      openId: form.openId || `manual-${nanoid(12)}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Nuevo usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium block mb-1.5">Nombre completo *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ej: María García López"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Rol *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as any })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="encuestador">Encuestador</option>
              <option value="revisor">Revisor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          {form.role === "encuestador" && (
            <div>
              <label className="text-sm font-medium block mb-1.5">Identificador</label>
              <input
                type="text"
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                placeholder="Ej: ENC-01"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Usuarios() {
  const { user: currentUser } = useAuth();
  const utils = trpc.useUtils();
  const { data: users = [], isLoading } = trpc.users.list.useQuery();

  if (currentUser?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Acceso restringido a administradores.</p>
        </div>
      </DashboardLayout>
    );
  }

  const encuestadores = users.filter((u) => u.role === "encuestador");
  const revisores = users.filter((u) => u.role === "revisor");
  const admins = users.filter((u) => u.role === "admin");

  const refresh = () => utils.users.list.invalidate();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground text-sm mt-1">{users.length} usuarios registrados</p>
          </div>
          <CreateUserDialog onCreated={refresh} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Encuestadores */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  Encuestadores ({encuestadores.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {encuestadores.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No hay encuestadores registrados.</p>
                ) : (
                  encuestadores.map((u) => <UserCard key={u.id} user={u} onUpdate={refresh} />)
                )}
              </CardContent>
            </Card>

            {/* Revisores */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Revisores ({revisores.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {revisores.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No hay revisores registrados.</p>
                ) : (
                  revisores.map((u) => <UserCard key={u.id} user={u} onUpdate={refresh} />)
                )}
              </CardContent>
            </Card>

            {/* Admins */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Administradores ({admins.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {admins.map((u) => <UserCard key={u.id} user={u} onUpdate={refresh} />)}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
