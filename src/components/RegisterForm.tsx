import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/apiConfig";

interface RegisterFormProps {
  onRegister: (sucess: boolean) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({
  onRegister,
  onSwitchToLogin,
}: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      onRegister(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: name,
          email,
          telefono: phone,
          contrasena: password,
        }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "No se pudo crear la cuenta");
      }
      toast({
        title: "¡Cuenta creada!",
        description: `Bienvenido ${name}, tu cuenta ha sido creada exitosamente`,
      });
      onRegister(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: "Error al registrarse",
        description: err?.message ?? "Inténtalo de nuevo.",
        variant: "destructive",
      });
      onRegister(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-energy rounded-full w-fit">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Crear Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.es"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+34 123 456 789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-fitness-red hover:bg-fitness-red-dark text-white"
              size="lg"
            >
              Crear Cuenta
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-fitness-orange hover:text-fitness-orange-light font-medium underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
