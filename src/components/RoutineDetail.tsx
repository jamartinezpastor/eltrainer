import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const API_URL = "http://127.0.0.1:8000/api";

interface Ejercicio {
  id: number;
  nombre: string;
  grupoMuscular: string;
  series: number;
  repeticiones: number;
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
}

export const RoutineDetail = ({ routineId, onBack }: RoutineDetailProps) => {
  const { toast, dismiss } = useToast();
  const [rutina, setRutina] = useState<UserRutina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const toastIdRef = useRef<string | null>(null);

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
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {rutina.nombre}
        </h2>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start gap-2 md:col-span-3">
              <ul className="text-xs text-muted-foreground list-disc pl-4">
                {rutina.ejercicios?.map((e) => (
                  <li key={e.id}>
                    <b>{e.nombre}</b> — Grupo muscular {e.grupoMuscular} –{" "}
                    {e.series} series de {e.repeticiones} repeticiones
                  </li>
                ))}
              </ul>
            </div>
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
