import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

interface HeaderProps {
  isLoggedIn: boolean;
  onShowLogin: () => void;
  onShowRegister: () => void;
  onShowProfile: () => void;
  onShowCreate: () => void;
  onLogout: () => void;
  onShowRoutines: () => void;
}

export const Header = ({
  isLoggedIn,
  onShowLogin,
  onShowRegister,
  onShowProfile,
  onShowCreate,
  onLogout,
  onShowRoutines,
}: HeaderProps) => {
  return (
    <header className="bg-card shadow-elegant border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onShowRoutines}
          >
            <div className="p-2 bg-gradient-energy rounded-lg shadow-red-glow group-hover:animate-pulse-glow transition-all">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TRAINING App
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" onClick={onShowLogin}>
                  Login
                </Button>
                <Button 
                  className="bg-fitness-red hover:bg-fitness-red-dark text-white"
                  onClick={onShowRegister}
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onShowProfile}>
                  Mi perfil
                </Button>
                <Button 
                  className="bg-fitness-orange hover:bg-fitness-orange-light text-white"
                  onClick={onShowCreate}
                >
                  Crear rutina
                </Button>
                <Button variant="ghost" onClick={onLogout}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};