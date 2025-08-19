import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoutineCard } from "@/components/RoutineCard";
import { Search } from "lucide-react";

interface Routine {
  id: string;
  name: string;
  description: string;
  level: "principiante" | "intermedio" | "avanzado";
  exercises: number;
  duration: string;
  author: string;
}

interface RoutineListProps {
  onViewRoutine: (id: string) => void;
}

const MOCK_ROUTINES: Routine[] = [
  {
    id: "1",
    name: "Fuerza Total",
    description: "Rutina completa para desarrollar fuerza en todo el cuerpo",
    level: "intermedio",
    exercises: 8,
    duration: "45 min",
    author: "Carlos Fitness"
  },
  {
    id: "2",
    name: "Cardio Intenso",
    description: "Quema calorías y mejora tu resistencia cardiovascular",
    level: "avanzado",
    exercises: 6,
    duration: "30 min",
    author: "Ana López"
  },
  {
    id: "3",
    name: "Principiantes",
    description: "Rutina perfecta para comenzar tu viaje fitness",
    level: "principiante",
    exercises: 5,
    duration: "25 min",
    author: "Miguel Trainer"
  },
  {
    id: "4",
    name: "Core Power",
    description: "Fortalece tu núcleo con ejercicios específicos",
    level: "intermedio",
    exercises: 7,
    duration: "35 min",
    author: "Sofia Fit"
  },
  {
    id: "5",
    name: "HIIT Explosivo",
    description: "Entrenamiento de alta intensidad para máximos resultados",
    level: "avanzado",
    exercises: 9,
    duration: "40 min",
    author: "David Power"
  },
  {
    id: "6",
    name: "Yoga Flow",
    description: "Flexibilidad y relajación en una rutina fluida",
    level: "principiante",
    exercises: 4,
    duration: "50 min",
    author: "Luna Zen"
  }
];

export const RoutineList = ({ onViewRoutine }: RoutineListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoutines, setFilteredRoutines] = useState(MOCK_ROUTINES);

  const handleSearch = () => {
    const filtered = MOCK_ROUTINES.filter(routine =>
      routine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutines(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Rutinas Disponibles
        </h2>
        <p className="text-lg text-muted-foreground">
          Encuentra la rutina perfecta para alcanzar tus objetivos
        </p>
      </div>

      {/* Search Section */}
      <div className="flex gap-3 mb-8 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Buscar por nombre, descripción o autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          className="bg-fitness-orange hover:bg-fitness-orange-light text-white"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onView={() => onViewRoutine(routine.id)}
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
              setFilteredRoutines(MOCK_ROUTINES);
            }}
            variant="outline"
            className="mt-4"
          >
            Mostrar todas las rutinas
          </Button>
        </div>
      )}
    </div>
  );
};