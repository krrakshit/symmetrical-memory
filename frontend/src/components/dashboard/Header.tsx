import { Bell, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"

interface HeaderProps {
  user: { fullName: string }
}

export default function Header({ user }: HeaderProps) {
  return (
    <motion.header
      className="bg-gray-800 shadow-md p-4 flex justify-between items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="text-sm font-medium text-gray-300">Welcome, {user?.fullName || "User"}</div>
      </div>
    </motion.header>
  )
}


