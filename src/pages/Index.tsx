import { useState } from "react";
import { Header } from "@/components/Header";
import { RoutineList } from "@/components/RoutineList";
import { RoutineDetail } from "@/components/RoutineDetail";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { CreateRoutineForm } from "@/components/CreateRoutineForm";
import { UserProfile } from "@/components/UserProfile";
import { useUser } from "@/hooks/UserContext";

type View = "routines" | "detail" | "login" | "register" | "create" | "edit" | "profile";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("routines");
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const { user, setUser } = useUser();

  const handleViewRoutine = (id: string) => {
    setSelectedRoutineId(id);
    setCurrentView("detail");
  };

  const handleEditRoutine = (id: string) => {
    setSelectedRoutineId(id);
    setCurrentView("edit");
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setCurrentView("routines");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSelectedRoutineId(null);
    setCurrentView("routines");
  };

  const renderContent = () => {
    switch (currentView) {
      case "detail":
        return (
          <RoutineDetail
            routineId={selectedRoutineId!}
            onBack={() => setCurrentView("routines")}
            onEdit={handleEditRoutine}
          />
        );
      case "login":
        return <LoginForm onLogin={(success: boolean) => handleLogin(success)} onSwitchToRegister={() => setCurrentView("register")} />;
      case "register":
        return <RegisterForm onRegister={handleLogin} onSwitchToLogin={() => setCurrentView("login")} />;
      case "create":
        return <CreateRoutineForm onBack={() => setCurrentView("routines")} />;
      case "edit":
        return (
          <CreateRoutineForm
            routineId={selectedRoutineId!}
            onBack={() => setCurrentView("detail")}
          />
        );
      case "profile":
        return (
          <UserProfile
            onBack={() => setCurrentView("routines")}
            onEditRoutine={handleEditRoutine}
          />
        );
      default:
        return <RoutineList onViewRoutine={handleViewRoutine} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header
        isLoggedIn={Boolean(user)}
        onShowLogin={() => setCurrentView("login")}
        onShowRegister={() => setCurrentView("register")}
        onShowProfile={() => setCurrentView("profile")}
        onShowCreate={() => setCurrentView("create")}
        onLogout={handleLogout}
        onShowRoutines={() => setCurrentView("routines")}
      />

      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
};

export default Index;