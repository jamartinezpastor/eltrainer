import { useState } from "react";
import { Header } from "@/components/Header";
import { RoutineList } from "@/components/RoutineList";
import { RoutineDetail } from "@/components/RoutineDetail";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { CreateRoutineForm } from "@/components/CreateRoutineForm";
import { UserProfile } from "@/components/UserProfile";

type View = "routines" | "detail" | "login" | "register" | "create" | "profile";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("routines");
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleViewRoutine = (id: string) => {
    setSelectedRoutineId(id);
    setCurrentView("detail");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView("routines");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("routines");
  };

  const renderContent = () => {
    switch (currentView) {
      case "detail":
        return (
          <RoutineDetail 
            routineId={selectedRoutineId!} 
            onBack={() => setCurrentView("routines")} 
          />
        );
      case "login":
        return <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />;
      case "register":
        return <RegisterForm onRegister={handleLogin} onSwitchToLogin={() => setCurrentView("login")} />;
      case "create":
        return <CreateRoutineForm onBack={() => setCurrentView("routines")} />;
      case "profile":
        return <UserProfile onBack={() => setCurrentView("routines")} />;
      default:
        return <RoutineList onViewRoutine={handleViewRoutine} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        isLoggedIn={isLoggedIn}
        onShowLogin={() => setCurrentView("login")}
        onShowRegister={() => setCurrentView("register")}
        onShowProfile={() => setCurrentView("profile")}
        onShowCreate={() => setCurrentView("create")}
        onLogout={handleLogout}
        onShowRoutines={() => setCurrentView("routines")}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
