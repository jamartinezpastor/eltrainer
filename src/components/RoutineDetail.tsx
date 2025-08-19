import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, User, Target, Play, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  completed: boolean;
}

interface RoutineDetailProps {
  routineId: string;
  onBack: () => void;
}

const MOCK_ROUTINE = {
  id: "1",
  name: "Fuerza Total",
  description: "Rutina completa para desarrollar fuerza en todo el cuerpo. Incluye ejercicios compuestos que trabajan múltiples grupos musculares para maximizar los resultados.",
  level: "intermedio" as const,
  duration: "45 min",
  author: "Carlos Fitness",
  exercises: [
    { id: "1", name: "Sentadillas", sets: 4, reps: "12-15", rest: "90s", completed: false },
    { id: "2", name: "Press de banca", sets: 4, reps: "8-10", rest: "120s", completed: false },
    { id: "3", name: "Peso muerto", sets: 3, reps: "6-8", rest: "180s", completed: false },
    { id: "4", name: "Dominadas", sets: 3, reps: "8-12", rest: "90s", completed: false },
    { id: "5", name: "Press militar", sets: 3, reps: "10-12", rest: "90s", completed: false },
    { id: "6", name: "Remo con barra", sets: 3, reps: "10-12", rest: "90s", completed: false },
    { id: "7", name: "Dips", sets: 3, reps: "10-15", rest: "60s", completed: false },
    { id: "8", name: "Plancha", sets: 3, reps: "30-60s", rest: "60s", completed: false },
  ]
};

export const RoutineDetail = ({ routineId, onBack }: RoutineDetailProps) => {
  const [exercises, setExercises] = useState<Exercise[]>(MOCK_ROUTINE.exercises);
  const { toast } = useToast();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "principiante": return "secondary";
      case "intermedio": return "default";
      case "avanzado": return "destructive";
      default: return "secondary";
    }
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, completed: !ex.completed }
          : ex
      )
    );
    
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise && !exercise.completed) {
      toast({
        title: "¡Ejercicio completado!",
        description: `Has completado ${exercise.name}`,
      });
    }
  };

  const completedCount = exercises.filter(ex => ex.completed).length;
  const progressPercentage = (completedCount / exercises.length) * 100;

  const startWorkout = () => {
    toast({
      title: "¡Entrenamiento iniciado!",
      description: "¡A darle con todo! 💪",
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {MOCK_ROUTINE.name}
        </h2>
      </div>

      {/* Routine Info Card */}
      <Card className="shadow-elegant mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-fitness-orange mb-2">
                {MOCK_ROUTINE.name}
              </CardTitle>
              <p className="text-muted-foreground">{MOCK_ROUTINE.description}</p>
            </div>
            <Badge variant={getLevelColor(MOCK_ROUTINE.level)} className="text-sm">
              {MOCK_ROUTINE.level.charAt(0).toUpperCase() + MOCK_ROUTINE.level.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-fitness-orange" />
              <span className="text-sm">{MOCK_ROUTINE.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-fitness-orange" />
              <span className="text-sm">{MOCK_ROUTINE.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-fitness-orange" />
              <span className="text-sm">{exercises.length} ejercicios</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Progreso del entrenamiento</span>
              <span>{completedCount}/{exercises.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
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

      {/* Exercises List */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-fitness-orange">Ejercicios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                  exercise.completed ? 'bg-fitness-green/10 border-fitness-green' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fitness-orange text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className={`font-medium ${exercise.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {exercise.name}
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} series • {exercise.reps} reps • {exercise.rest} descanso
                    </div>
                  </div>
                </div>
                <Button
                  variant={exercise.completed ? "default" : "outline"}
                  size="icon"
                  onClick={() => toggleExerciseComplete(exercise.id)}
                  className={exercise.completed ? "bg-fitness-green hover:bg-fitness-green/80 text-white" : ""}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};