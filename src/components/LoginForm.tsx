import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/UserContext";
import { API_URL } from "@/lib/apiConfig";

interface LoginFormProps {
  onLogin: (success: boolean) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onLogin, onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      onLogin(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena: password }),
      });

      if (!res.ok) {
        // 400/401/etc
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Credenciales incorrectas");
      }

      const usuario = await res.json();

      localStorage.setItem("token", usuario.access_token);
      setUser({
        id: usuario.id,
        name: usuario.nombre,
        email: usuario.email,
        phone: usuario.telefono,
        access_token: usuario.access_token,
      });

      // ÉXITO: ahora sí
      toast({
        title: "👋🏻 ¡Bienvenido!",
        description: "Sesión iniciada exitosamente.",
      });
      onLogin(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast({
        title: "❌ Error al iniciar sesión",
        description: /*err?.message ?? */ "Verifica tu nombre y contraseña.",
        variant: "destructive",
      });
      onLogin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-energy rounded-full w-fit">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Iniciar Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-fitness-orange hover:bg-fitness-orange-light text-white"
              size="lg"
            >
              Entrar
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-fitness-red hover:text-fitness-red-dark font-medium underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
