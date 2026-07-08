/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/UserContext";
import { API_URL } from "@/lib/apiConfig";

// Se ajusta el formulario para CUMPLIR el esquema del backend:
// RutinaCrearSimple => { nombre, descripcion?, nivel, ejerciciosIds: number[] }
// (no se envía usuarioId ni objetos de ejercicios)
// ver schemas/rutina.py y schemas/ejercicio.py en el backend.

interface Exercise {
  id: number;
  nombre: string;
  grupoMuscular: string;
  series: number;
  repeticiones: number;
}

interface CreateRoutineFormProps {
  onBack: () => void;
}

export const CreateRoutineForm = ({ onBack }: CreateRoutineFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"principiante" | "intermedio" | "avanzado" | "">("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const fetchExercises = async () => {
    const controller = new AbortController();
    setLoadingExercises(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/ejercicios`, {
        signal: controller.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "No se pudieron cargar los ejercicios"));
      const data: Exercise[] = await res.json();
      setExercises(data);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err?.message ?? "No se pudieron cargar los ejercicios.", variant: "destructive" });
    } finally {
      setLoadingExercises(false);
    }
  };

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const clearSelection = () => setSelectedIds([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Debes iniciar sesión", description: "Inicia sesión para poder crear rutinas.", variant: "destructive" });
      return;
    }
    if (!name || !level || selectedIds.length === 0) {
      toast({ title: "Faltan datos", description: "Completa nombre, nivel y selecciona al menos un ejercicio.", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem("token");
    const payload = {
      nombre: name,
      descripcion: description || undefined,
      nivel: level,
      ejerciciosIds: selectedIds, // <- Clave para cumplir el esquema
    };

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/rutinas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "No se pudo crear la rutina");
        throw new Error(msg || "No se pudo crear la rutina");
      }

      toast({ title: "¡Rutina creada!", description: `"${name}" se ha guardado exitosamente.` });

      // Reset form y volver al listado
      setName("");
      setDescription("");
      setLevel("");
      clearSelection();
      onBack();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error al guardar", description: err?.message ?? "Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Crear Nueva Rutina</h2>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-xl text-fitness-orange">Detalles de la Rutina</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="routine-name">Nombre de la rutina</Label>
              <Input id="routine-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Rutina de Fuerza" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routine-description">Descripción (opcional)</Label>
              <Textarea
                id="routine-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu rutina..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Nivel de dificultad</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as any)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principiante">
                    <Badge variant="secondary">Principiante</Badge>
                  </SelectItem>
                  <SelectItem value="intermedio">
                    <Badge className="bg-fitness-orange text-white">Intermedio</Badge>
                  </SelectItem>
                  <SelectItem value="avanzado">
                    <Badge variant="destructive">Avanzado</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Selecciona ejercicios ({selectedIds.length})</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={clearSelection} disabled={selectedIds.length === 0}>Limpiar</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={fetchExercises} disabled={loadingExercises}>
                    <RefreshCw className={`h-4 w-4 mr-1 ${loadingExercises ? "animate-spin" : ""}`} />
                    Recargar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-muted/30">
                {loadingExercises ? (
                  <div className="col-span-full text-center text-muted-foreground py-6">Cargando ejercicios...</div>
                ) : exercises.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground py-6">No hay ejercicios disponibles</div>
                ) : (
                  exercises.map((ex) => (
                    <Button
                      key={ex.id}
                      type="button"
                      variant={selectedIds.includes(ex.id) ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => toggleSelection(ex.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {selectedIds.includes(ex.id) ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        <div className="text-left">
                          <div className="font-medium">{ex.nombre}</div>
                          <div className="text-sm text-muted-foreground">{ex.grupoMuscular} · {ex.series}x{ex.repeticiones}</div>
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={saving || !name || !level || selectedIds.length === 0}>
                {saving ? "Guardando..." : "Crear Rutina"}
              </Button>
              <Button type="button" variant="outline" onClick={onBack} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};