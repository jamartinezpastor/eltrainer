import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, Target, Trophy } from "lucide-react";

interface UserProfileProps {
  onBack: () => void;
}

interface UserRoutine {
  id: string;
  name: string;
  level: "principiante" | "intermedio" | "avanzado";
  exercises: number;
  completed: number;
}

const mockUser = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+34 600 123 456",
  level: "intermedio",
  totalWorkouts: 24,
  streak: 7,
};

const mockUserRoutines: UserRoutine[] = [
  { id: "1", name: "Mi Rutina Matutina", level: "intermedio", exercises: 6, completed: 18 },
  { id: "2", name: "Fuerza y Resistencia", level: "avanzado", exercises: 8, completed: 12 },
  { id: "3", name: "Cardio Intenso", level: "intermedio", exercises: 5, completed: 25 },
];

export const UserProfile = ({ onBack }: UserProfileProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "principiante": return "secondary";
      case "intermedio": return "default";
      case "avanzado": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Mi Perfil
        </h2>
      </div>

      <div className="grid gap-6">
        {/* User Info Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-fitness-orange">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{mockUser.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{mockUser.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>Nivel: </span>
              <Badge variant={getLevelColor(mockUser.level)}>
                {mockUser.level.charAt(0).toUpperCase() + mockUser.level.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-fitness-orange">
              <Trophy className="h-5 w-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                <div className="text-2xl font-bold text-primary">{mockUser.totalWorkouts}</div>
                <div className="text-sm text-muted-foreground">Entrenamientos</div>
              </div>
              <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                <div className="text-2xl font-bold text-fitness-red">{mockUser.streak}</div>
                <div className="text-sm text-muted-foreground">Días seguidos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Routines Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-fitness-orange">Mis Rutinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUserRoutines.map((routine) => (
                <div
                  key={routine.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{routine.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{routine.exercises} ejercicios</span>
                      <span>•</span>
                      <span>{routine.completed} completados</span>
                    </div>
                  </div>
                  <Badge variant={getLevelColor(routine.level)}>
                    {routine.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};