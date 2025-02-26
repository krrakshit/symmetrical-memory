import { motion } from "framer-motion"
import { Users, CheckSquare, Star } from "lucide-react"

export default function Summary() {
  const summaryItems = [
    { icon: Users, label: "Organizations", count: 5 },
    { icon: CheckSquare, label: "Tasks", count: 12 },
    { icon: Star, label: "Completed Tasks", count: 8 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {summaryItems.map((item, index) => (
        <motion.div
          key={item.label}
          className="bg-[#303030] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <item.icon className="h-8 w-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-gray-100">{item.label}</h3>
            </div>
            <span className="text-3xl font-bold text-gray-100">{item.count}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}


