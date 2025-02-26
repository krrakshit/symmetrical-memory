"use client"

import { motion } from "framer-motion"
import { CheckCircle, Circle, Clock } from "lucide-react"

export default function Tasks() {
  const tasks = [
    { id: "1", title: "Task 1", status: "completed", dueDate: "2025-03-15" },
    { id: "2", title: "Task 2", status: "in-progress", dueDate: "2025-03-20" },
    { id: "3", title: "Task 3", status: "pending", dueDate: "2025-03-25" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-400" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="bg-[#303030] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center">
              {getStatusIcon(task.status)}
              <span className="ml-3 text-gray-100">{task.title}</span>
            </div>
            <span className="text-sm text-gray-300">Due: {task.dueDate}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


