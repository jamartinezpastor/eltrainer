/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, RefreshCw, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/UserContext";
import { API_URL } from "@/lib/apiConfig";

// Se ajusta el formulario para CUMPLIR el esquema del backend:
// RutinaCrearSimple => { nombre, descripcion?, nivel, ejercicios: {ejercicioId, series, repeticiones}[] }
// (no se envía usuarioId)
// ver schemas/rutina.py y schemas/ejercicio.py en el backend.

interface Exercise {
  id: number;
  nombre: string;
  grupoMuscular: string;
  gif_url: string;
}

interface SelectedExercise {
  series: number;
  repeticiones: number;
}

interface CreateRoutineFormProps {
  routineId?: string;
  onBack: () => void;
}

export const CreateRoutineForm = ({ routineId, onBack }: CreateRoutineFormProps) => {
  const isEditing = Boolean(routineId);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<"principiante" | "intermedio" | "avanzado" | "">("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selected, setSelected] = useState<Record<number, SelectedExercise>>({});
  const [busqueda, setBusqueda] = useState("");
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [loadingRoutine, setLoadingRoutine] = useState(isEditing);
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

  useEffect(() => {
    if (!routineId) return;
    const controller = new AbortController();
    const token = localStorage.getItem("token");
    setLoadingRoutine(true);

    fetch(`${API_URL}/rutinas/${routineId}`, {
      signal: controller.signal,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text().catch(() => "No se pudo cargar la rutina"));
        return res.json();
      })
      .then((data: any) => {
        setName(data.nombre);
        setDescription(data.descripcion ?? "");
        setLevel(data.nivel);
        const precargados: Record<number, SelectedExercise> = {};
        for (const e of data.ejercicios) {
          precargados[e.id] = { series: e.series, repeticiones: e.repeticiones };
        }
        setSelected(precargados);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          toast({ title: "Error", description: "No se pudo cargar la rutina a editar.", variant: "destructive" });
        }
      })
      .finally(() => setLoadingRoutine(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routineId]);

  const toggleSelection = (id: number) => {
    setSelected((prev) => {
      if (prev[id]) {
        const { [id]: _omit, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { series: 3, repeticiones: 12 } };
    });
  };

  const updateSelected = (id: number, campo: "series" | "repeticiones", valor: number) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: Math.max(1, valor) },
    }));
  };

  const clearSelection = () => setSelected({});

  const selectedIds = useMemo(() => Object.keys(selected).map(Number), [selected]);

  const filteredExercises = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return exercises;
    return exercises.filter(
      (ex) =>
        ex.nombre.toLowerCase().includes(term) ||
        ex.grupoMuscular.toLowerCase().includes(term)
    );
  }, [exercises, busqueda]);

  const exerciseById = useMemo(() => {
    const map = new Map<number, Exercise>();
    for (const ex of exercises) map.set(ex.id, ex);
    return map;
  }, [exercises]);

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
      ejercicios: selectedIds.map((id) => ({
        ejercicioId: id,
        series: selected[id].series,
        repeticiones: selected[id].repeticiones,
      })),
    };

    setSaving(true);
    try {
      const url = isEditing ? `${API_URL}/rutinas/${routineId}` : `${API_URL}/rutinas`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "No se pudo guardar la rutina");
        throw new Error(msg || "No se pudo guardar la rutina");
      }

      toast({
        title: isEditing ? "¡Rutina actualizada!" : "¡Rutina creada!",
        description: `"${name}" se ha guardado exitosamente.`,
      });

      if (!isEditing) {
        setName("");
        setDescription("");
        setLevel("");
        clearSelection();
      }
      onBack();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error al guardar", description: err?.message ?? "Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loadingRoutine) {
    return <div className="text-center text-muted-foreground">Cargando rutina...</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {isEditing ? "Editar Rutina" : "Crear Nueva Rutina"}
        </h2>
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
              <div className="flex items-center justify-between gap-2">
                <Label>Buscar ejercicios</Label>
                <Button type="button" variant="ghost" size="sm" onClick={fetchExercises} disabled={loadingExercises}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${loadingExercises ? "animate-spin" : ""}`} />
                  Recargar
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Busca por nombre o grupo muscular (ej: push up, chest...)"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {filteredExercises.length} ejercicio{filteredExercises.length === 1 ? "" : "s"} · {selectedIds.length} seleccionado{selectedIds.length === 1 ? "" : "s"}
                </span>
                <Button type="button" variant="outline" size="sm" onClick={clearSelection} disabled={selectedIds.length === 0}>
                  Limpiar selección
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg bg-muted/30">
                {loadingExercises ? (
                  <div className="col-span-full text-center text-muted-foreground py-6">Cargando ejercicios...</div>
                ) : filteredExercises.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground py-6">No hay ejercicios que coincidan con tu búsqueda</div>
                ) : (
                  filteredExercises.map((ex) => (
                    <Button
                      key={ex.id}
                      type="button"
                      variant={selected[ex.id] ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => toggleSelection(ex.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={ex.gif_url}
                          alt={ex.nombre}
                          loading="lazy"
                          className="w-10 h-10 rounded-md object-cover shrink-0 bg-background"
                        />
                        {selected[ex.id] ? <X className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
                        <div className="text-left min-w-0">
                          <div className="font-medium truncate">{ex.nombre}</div>
                          <div className="text-sm text-muted-foreground">{ex.grupoMuscular}</div>
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="space-y-3">
                <Label>Ajusta series y repeticiones</Label>
                <div className="space-y-2 max-h-72 overflow-y-auto p-2 border rounded-lg bg-muted/30">
                  {selectedIds.map((id) => {
                    const ex = exerciseById.get(id);
                    if (!ex) return null;
                    return (
                      <div key={id} className="flex items-center gap-3 p-2 rounded-md bg-background">
                        <img
                          src={ex.gif_url}
                          alt={ex.nombre}
                          loading="lazy"
                          className="w-10 h-10 rounded-md object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{ex.nombre}</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Label htmlFor={`series-${id}`} className="text-xs text-muted-foreground">Series</Label>
                          <Input
                            id={`series-${id}`}
                            type="number"
                            min={1}
                            value={selected[id].series}
                            onChange={(e) => updateSelected(id, "series", Number(e.target.value))}
                            className="w-16 h-8"
                          />
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Label htmlFor={`reps-${id}`} className="text-xs text-muted-foreground">Reps</Label>
                          <Input
                            id={`reps-${id}`}
                            type="number"
                            min={1}
                            value={selected[id].repeticiones}
                            onChange={(e) => updateSelected(id, "repeticiones", Number(e.target.value))}
                            className="w-16 h-8"
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => toggleSelection(id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={saving || !name || !level || selectedIds.length === 0}>
                {saving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Rutina"}
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
