import { motion } from "framer-motion"
import { Button } from "../ui/button"

export default function Profile() {
  const user = {
    fullName: "John Doe",
    email: "john@example.com",
    createdAt: "2025-01-01",
  }

  return (
    <motion.div
      className="bg-[#303030] bg-opacity-50 backdrop-blur-lg rounded-lg shadow-lg p-6 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-100 mb-6">My Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-300">Full Name</label>
          <p className="text-lg font-medium text-gray-100">{user.fullName}</p>
        </div>
        <div>
          <label className="text-sm text-gray-300">Email</label>
          <p className="text-lg font-medium text-gray-100">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-300">Member Since</label>
          <p className="text-lg font-medium text-gray-100">{user.createdAt}</p>
        </div>
      </div>
      <Button className="mt-6 w-full">Edit Profile</Button>
    </motion.div>
  )
}


