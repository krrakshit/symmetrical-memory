import { Toaster } from "sonner"
import { LoginForm } from "./components/auth/LoginForm"
import { useAtom } from "jotai"
import { pageAtom } from "./atoms/pageAtom"
import { SignupForm } from "./components/auth/SignupForm"

const App = () => {
  const [whichPage] = useAtom(pageAtom)

  let PageComponent;
  switch (whichPage) {
    case "Login":
      PageComponent = <LoginForm />;
      break;
    case "Signup":
      PageComponent = <SignupForm />;
      break;
    //case "Dashboard":
    //PageComponent = <Dashboard />;
    //break;
    default:
      PageComponent = <LoginForm />;
  }

  return (
    <div className="bg-[#09090B]">
      <Toaster position="top-center" />
      {PageComponent}
    </div>
  )
}

export default App
