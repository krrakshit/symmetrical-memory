import { Home, Users, CheckSquare, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

interface SidebarProps {
  setView: (view: View) => void;
  currentView: View;
}

type View = "summary" | "organizations" | "tasks" | "profile";

interface MenuItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  view: View;
}

export default function Sidebar({ setView, currentView }: SidebarProps) {
  const menuItems: MenuItem[] = [
    { icon: Home, label: "Home", view: "summary" }, // Changed label from "Summary" to "Home"
    { icon: Users, label: "Organizations", view: "organizations" },
    { icon: CheckSquare, label: "Tasks", view: "tasks" },
    { icon: User, label: "Profile", view: "profile" },
  ];

  return (
    <motion.aside
      className="w-64 bg-[#171717] text-gray-100 p-4 shadow-lg"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.view}
            variant="ghost"
            className={`w-full justify-start text-left font-medium transition duration-200 cursor-pointer 
              ${currentView === item.view
                ? "bg-[#4d4d4d] text-gray-100 hover:text-gray-100 hover:bg-[#212121]"
                : "hover:text-gray-100 hover:bg-[#212121]"
              }`}
            onClick={() => setView(item.view)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </motion.aside>
  );
}

