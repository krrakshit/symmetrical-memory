//frontend/src/App.tsx
import { Toaster } from "sonner"
import { LoginForm } from "./components/auth/LoginForm"
import { useAtom } from "jotai"
import { pageAtom, authAtom } from "./atoms/pageAtom"
import { SignupForm } from "./components/auth/SignupForm"
import Dashboard from "./components/dashboard/Dashboard"
import { useState, useEffect } from "react"
import Loader from "./components/loaders/loader"
import { useAuth } from "./hooks/useAuth"

const App = () => {
  const [whichPage, setWhichPage] = useAtom(pageAtom);
  const [isHydrated, setIsHydrated] = useState(false);
  const { checkAuth } = useAuth();
  const [auth] = useAtom(authAtom);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authResult = await checkAuth();
        if (!authResult.isAuthenticated && whichPage === "Dashboard") {
          setWhichPage("Login");
        } else if (authResult.isAuthenticated && whichPage === "Login") {
          setWhichPage("Dashboard");
        }
      } finally {
        setIsHydrated(true);
      }
    };
    initAuth();
  }, []);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      setWhichPage("Login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [setWhichPage]);

  if (!isHydrated) {
    return <Loader />;
  }

  let PageComponent;
  switch (whichPage) {
    case "Login":
      PageComponent = auth.isAuthenticated ? <Dashboard /> : <LoginForm />;
      break;
    case "Signup":
      PageComponent = auth.isAuthenticated ? <Dashboard /> : <SignupForm />;
      break;
    case "Dashboard":
      PageComponent = auth.isAuthenticated ? <Dashboard /> : <LoginForm />;
      break;
    default:
      PageComponent = auth.isAuthenticated ? <Dashboard /> : <LoginForm />;
  }

  return (
    <div className="bg-[#09090B] min-h-screen">
      <Toaster position="top-center" />
      {PageComponent}
    </div>
  );
}

export default App;

