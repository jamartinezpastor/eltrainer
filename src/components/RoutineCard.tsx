import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Target } from "lucide-react";

interface Routine {
  id: string;
  name: string;
  description: string;
  level: "principiante" | "intermedio" | "avanzado";
  exercises: number;
  duration: string;
  author: string;
}

interface RoutineCardProps {
  routine: Routine;
  onView: () => void;
}

export const RoutineCard = ({ routine, onView }: RoutineCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "principiante": return "secondary";
      case "intermedio": return "default";
      case "avanzado": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card className="shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:text-fitness-orange transition-colors">
            {routine.name}
          </CardTitle>
          <Badge variant={getLevelColor(routine.level)}>
            {routine.level}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {routine.description}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{routine.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{routine.exercises} ejercicios</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{routine.author}</span>
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