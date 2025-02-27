//frontend/src/components/dashboard/Tasks.tsx
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, Clock } from "lucide-react"
import TaskList from "../tasks/TaskList"
import { Task } from "@/services/task.service"
import { getUserOrganizations } from "@/services/organization.service"

export default function Tasks() {
  const [selectedOrg, setSelectedOrg] = useState<string | undefined>(undefined);
  const [organizations, setOrganizations] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const orgs = await getUserOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    fetchOrgs();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Tasks</h2>
        
        {/* Organization Filter */}
        <select
          value={selectedOrg || ""}
          onChange={(e) => setSelectedOrg(e.target.value || undefined)}
          className="w-full sm:w-auto p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="">All Organizations</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Task List Component */}
      <TaskList orgId={selectedOrg} />
    </div>
  )
}


