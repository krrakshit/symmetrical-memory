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
  const [isLoading, setIsLoading] = useState(true);
  const { checkAuth } = useAuth();
  const [auth] = useAtom(authAtom);

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        await checkAuth();
      } finally {
        setIsHydrated(true);
        setIsLoading(false);
      }
    };
    initAuth();
  }, [checkAuth]);

  if (!isHydrated || isLoading) {
    return <Loader />;
  }

  // Determine which component to show based on auth state and current page
  let PageComponent;
  if (auth.isAuthenticated) {
    PageComponent = <Dashboard />;
  } else {
    PageComponent = whichPage === "Signup" ? <SignupForm /> : <LoginForm />;
  }

  return (
    <div className="bg-[#09090B] min-h-screen">
      <Toaster position="top-center" />
      {PageComponent}
    </div>
  );
}

export default App;

