import { Toaster } from "sonner"
import { LoginForm } from "./components/auth/LoginForm"

const App = () => {
  return (
    <div className="bg-[#09090B]">
      <Toaster position="top-center" />
      <LoginForm />
    </div>
  )
}

export default App
