import { Home, Users, CheckSquare, User } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"

interface SidebarProps {
  setView: (view: View) => void
}

type View = "summary" | "organizations" | "tasks" | "profile"

export default function Sidebar({ setView }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: "Summary", view: "summary" },
    { icon: Users, label: "Organizations", view: "organizations" },
    { icon: CheckSquare, label: "Tasks", view: "tasks" },
    { icon: User, label: "Profile", view: "profile" },
  ]

  return (
    <motion.aside
      className="w-64 bg-gray-800 text-gray-100 p-4 shadow-lg"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.view}
            variant="ghost"
            className="w-full justify-start text-left font-medium"
            onClick={() => setView(item.view)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </motion.aside>
  )
}


