import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  id: string;
  name: string;
  muscle: string;
}

interface CreateRoutineFormProps {
  onBack: () => void;
}

const EXERCISES: Exercise[] = [
  { id: "1", name: "Push-ups", muscle: "Pecho" },
  { id: "2", name: "Sentadillas", muscle: "Piernas" },
  { id: "3", name: "Flexiones", muscle: "Brazos" },
  { id: "4", name: "Burpees", muscle: "Full body" },
  { id: "5", name: "Plancha", muscle: "Core" },
  { id: "6", name: "Dominadas", muscle: "Espalda" },
  { id: "7", name: "Lunges", muscle: "Piernas" },
  { id: "8", name: "Mountain climbers", muscle: "Core" },
];

export const CreateRoutineForm = ({ onBack }: CreateRoutineFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const { toast } = useToast();

  const handleAddExercise = (exercise: Exercise) => {
    if (!selectedExercises.find(ex => ex.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExercises.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un ejercicio",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "¡Rutina creada!",
      description: `"${name}" se ha creado exitosamente`,
    });

    // Reset form
    setName("");
    setDescription("");
    setLevel("");
    setSelectedExercises([]);
    onBack();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Crear Nueva Rutina
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
              <Input
                id="routine-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Rutina de Fuerza"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routine-description">Descripción</Label>
              <Textarea
                id="routine-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe tu rutina..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Nivel de dificultad</Label>
              <Select value={level} onValueChange={setLevel} required>
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

            <div className="space-y-4">
              <Label>Ejercicios seleccionados ({selectedExercises.length})</Label>
              
              {selectedExercises.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
                  {selectedExercises.map((exercise) => (
                    <Badge
                      key={exercise.id}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      {exercise.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveExercise(exercise.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Agregar ejercicios</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                  {EXERCISES.map((exercise) => (
                    <Button
                      key={exercise.id}
                      type="button"
                      variant="outline"
                      className="justify-start h-auto p-3"
                      onClick={() => handleAddExercise(exercise)}
                      disabled={selectedExercises.some(ex => ex.id === exercise.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-muted-foreground">{exercise.muscle}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={!name || !description || !level || selectedExercises.length === 0}>
                Crear Rutina
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};