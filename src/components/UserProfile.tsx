import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Target,
  Trophy,
  IdCard,
} from "lucide-react";
import { useUser } from "@/hooks/UserContext";
import { API_URL } from "@/lib/apiConfig";

interface UserProfileProps {
  onBack: () => void;
}

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

export const UserProfile = ({ onBack }: UserProfileProps) => {
  const { user, logout } = useUser();
  const [rutinas, setRutinas] = useState<UserRutina[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/usuarios/${user.id}/rutinas`)
      .then((res) => res.json())
      .then((data) => {
        setRutinas(data);
      })
      .catch((err) => console.error("Error cargando rutinas", err))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return <p>No hay usuario logueado</p>;

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
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* User rutinas Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-fitness-orange">Mis Rutinas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Cargando rutinas...</p>
            ) : rutinas.length === 0 ? (
              <p>Este usuario no tiene rutinas guardadas todavía.</p>
            ) : (
              <div className="space-y-4">
                {rutinas.map((rutina) => (
                  <div
                    key={rutina.id}
                    className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:shadow-md hover:bg-fitness-orange-light/20 hover:border-fitness-orange-light hover:border-1 hover:cursor-pointer"
                  >
                    <div className="space-y-1 ">
                      <h4 className="font-medium">
                        {rutina.id} - {rutina.nombre}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground  ">
                        <ul className="text-xs text-muted-foreground list-disc pl-4 ">
                          {rutina.ejercicios.map((e) => (
                            <li key={e.id}>
                              <b>{e.nombre}</b> - Grupo muscular{" "}
                              {e.grupoMuscular} – {e.series} series de{" "}
                              {e.repeticiones} repeticiones
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Badge variant={getLevelColor(rutina.nivel)}>
                      {rutina.nivel}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
