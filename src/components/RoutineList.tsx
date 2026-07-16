import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoutineCard } from "@/components/RoutineCard";
import { Search } from "lucide-react";
import SplitText from "./ui/SplitText";
import { API_URL } from "@/lib/apiConfig";
import { useUser } from "@/hooks/UserContext";

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

interface RoutineListProps {
  onViewRoutine: (id: string) => void;
}

export const RoutineList = ({ onViewRoutine }: RoutineListProps) => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [rutinas, setRutinas] = useState<UserRutina[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<UserRutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);

    fetch(`${API_URL}/rutinas`, {
      signal: controller.signal,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(
            await res.text().catch(() => "Error cargando rutinas")
          );
        return res.json();
      })
      .then((data: UserRutina[]) => {
        setRutinas(data);
        setFilteredRoutines(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error cargando rutinas", err);
          setError("No se pudieron cargar las rutinas");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredRoutines(rutinas);
      return;
    }
    const filtered = rutinas.filter(
      (r) =>
        r.nombre.toLowerCase().includes(term) ||
        (r.descripcion ?? "").toLowerCase().includes(term)
    );
    setFilteredRoutines(filtered);
  };

  const handleKeyUp = () => handleSearch();
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
          <SplitText
            text="Rutinas Disponibles"
            className="text-4xl font-bold mb-4 text-fitness-orange"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        <p className="text-lg text-muted-foreground">
          Encuentra la rutina perfecta para alcanzar tus objetivos
        </p>
      </div>

      {/* Search Section */}
      <div className="flex gap-3 mb-8 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={handleKeyUp}
          className="flex-1"
        />
        <Button
          onClick={handleSearch}
          className="bg-fitness-orange hover:bg-fitness-orange-light text-white"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading / Error / Grid */}
      {loading ? (
        <div className="text-center text-muted-foreground">
          Cargando rutinas...
        </div>
      ) : error ? (
        <div className="text-center text-destructive">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutines.map((rutina) => (
              <RoutineCard
                key={rutina.id}
                rutina={rutina}
                onView={() => onViewRoutine(String(rutina.id))}
                isOwn={user?.id !== undefined && rutina.usuarioId === user.id}
              />
            ))}
          </div>

          {filteredRoutines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No se encontraron rutinas que coincidan con tu búsqueda
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilteredRoutines(rutinas);
                }}
                variant="outline"
                className="mt-4"
              >
                Mostrar todas las rutinas
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
