import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import StarBorder from "./StarBorder";

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
<header className="relative bg-card shadow-elegant border-b sticky top-0 z-50">
  {/* Fondo mosaico detrás del todo */}
  <div
    className="absolute inset-0 -z-10 bg-gray-300/25 pointer-events-none
               [mask-image:url('/img/logo.svg')] [mask-repeat:repeat]
               [-webkit-mask-image:url('/img/logo.svg')] [-webkit-mask-repeat:repeat]"
  />

  {/* Contenido por encima */}
  <div className="relative z-10 container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onShowRoutines}
      >
        <div className="flex items-center min-w-[150px]">
          <StarBorder
            as="div"
            className="custom-class"
            color="orange"
            speed="4s"
            thickness={1}
          >
            <img
              src="/img/logotipo.svg"
              alt="ELTRAINER App"
              className="h-14 w-auto text-[#f97015] transition duration-300 hover:drop-shadow-[0_0_45px_#aaaaaa]"
              loading="eager"
              decoding="async"
            />
          </StarBorder>
        </div>
      </div>

      <nav className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" onClick={onShowLogin}>
                  Login
                </Button>
                <Button
                  className="bg-fitness-orange hover:bg-fitness-orange-light text-white"
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
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="hover:bg-fitness-red-dark hover:text-white"
                >
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
