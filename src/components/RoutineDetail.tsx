import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { API_URL } from "@/lib/apiConfig";
import { useUser } from "@/hooks/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Ejercicio {
  id: number;
  nombre: string;
  grupoMuscular: string;
  series: number;
  repeticiones: number;
  gif_url: string;
}
interface UserRutina {
  id: number;
  nombre: string;
  descripcion?: string;
  nivel: "principiante" | "intermedio" | "avanzado";
  usuarioId?: number;
  ejercicios: Ejercicio[];
}

interface RoutineDetailProps {
  routineId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export const RoutineDetail = ({ routineId, onBack, onEdit }: RoutineDetailProps) => {
  const { toast, dismiss } = useToast();
  const { user } = useUser();
  const [rutina, setRutina] = useState<UserRutina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const toastIdRef = useRef<string | null>(null);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Ejercicio | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/rutinas/${routineId}`.trim(), {
      signal: controller.signal,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(
            await res.text().catch(() => "Error cargando rutina")
          );
        return res.json();
      })
      .then((data: UserRutina) => setRutina(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error cargando rutina", err);
          setError("No se pudo cargar la rutina");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [routineId]);

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case "principiante":
        return "secondary";
      case "intermedio":
        return "default";
      case "avanzado":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const stopWorkout = () => {
    if (toastIdRef.current) {
      dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    const elapsed = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;
    toast({
      title: "🏁 Entrenamiento finalizado",
      description: `Duración total: ${elapsed}s`,
    });
  };

  const startWorkout = () => {
    startTimeRef.current = Date.now();

    // Mostramos un único toast persistente con el cronómetro dentro
    const { id } = toast({
      duration: Infinity,
      title: "⏱️ Entrenamiento en curso",
      description: <TimerContent timer={0} />,
      action: (
        <ToastAction altText="Detener" onClick={stopWorkout}>
          Detener
        </ToastAction>
      ),
    });
    toastIdRef.current = id;
  };

  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        dismiss(toastIdRef.current);
      }
    };
  }, []);

  if (loading)
    return (
      <div className="text-center text-muted-foreground">
        Cargando rutina...
      </div>
    );
  if (error) return <div className="text-center text-destructive">{error}</div>;
  if (!rutina)
    return (
      <div className="text-center text-muted-foreground">
        Rutina no encontrada
      </div>
    );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex-1">
          {rutina.nombre}
        </h2>
        {user && rutina.usuarioId === user.id && (
          <Button variant="outline" size="sm" onClick={() => onEdit(routineId)}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
        )}
      </div>

      {/* Routine Info Card */}
      <Card className="shadow-elegant mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              {rutina.descripcion && (
                <p className="text-muted-foreground">{rutina.descripcion}</p>
              )}
            </div>
            <Badge variant={getLevelColor(rutina.nivel)} className="text-sm">
              {rutina.nivel.charAt(0).toUpperCase() + rutina.nivel.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {rutina.ejercicios?.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEjercicioSeleccionado(e)}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors text-left"
              >
                <img
                  src={e.gif_url}
                  alt={e.nombre}
                  loading="lazy"
                  className="w-14 h-14 rounded-md object-cover shrink-0 bg-background"
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{e.nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {e.grupoMuscular} · {e.series} series de {e.repeticiones} repeticiones
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={startWorkout}
            className="w-full bg-fitness-red hover:bg-fitness-red-dark text-white"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            Comenzar Entrenamiento
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={ejercicioSeleccionado !== null}
        onOpenChange={(open) => !open && setEjercicioSeleccionado(null)}
      >
        <DialogContent className="max-w-md">
          {ejercicioSeleccionado && (
            <>
              <DialogHeader>
                <DialogTitle>{ejercicioSeleccionado.nombre}</DialogTitle>
              </DialogHeader>
              <img
                src={ejercicioSeleccionado.gif_url}
                alt={ejercicioSeleccionado.nombre}
                className="w-full rounded-md bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                {ejercicioSeleccionado.grupoMuscular} · {ejercicioSeleccionado.series} series de{" "}
                {ejercicioSeleccionado.repeticiones} repeticiones
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// 👇 Este componente se re-renderiza cuando cambia `timer`
const TimerContent = ({ timer }: { timer: number }) => {
  const [time, setTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>Tiempo: {time}s</span>;
};
