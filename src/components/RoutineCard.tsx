import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Target } from "lucide-react";
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
  // author?: string;
}

interface RoutineCardProps {
  rutina: UserRutina;
  onView: () => void;
}

export const RoutineCard = ({ rutina, onView }: RoutineCardProps) => {
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

  return (
    <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-fitness-orange transition-colors">
            {rutina.nombre}
          </CardTitle>
          <Badge variant={getLevelColor(rutina.nivel)}>{rutina.nivel}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {rutina.descripcion}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{routine.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{routine.exercises} ejercicios</span>
          </div>
          */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Creada por el usuario con ID: {rutina.usuarioId}</span>
          </div>
          <Button
            onClick={onView}
            className="w-full bg-fitness-orange hover:bg-fitness-orange-light text-white"
          >
            Ver Rutina
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
