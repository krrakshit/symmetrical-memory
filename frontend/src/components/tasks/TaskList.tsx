// components/tasks/TaskList.tsx

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getTasks, getTaskById } from "@/services/task.service";
import { toast } from "@/components/hooks/use-toast";
import TaskDetails from "../modals/TaskDetails";
import TaskForm from "../forms/TaskForm";
import { Task } from "@/services/task.service";
import { getUserOrganizations, Organization } from "@/services/organization.service";
import { useAtom } from "jotai";
import { organizationsAtom } from "@/atoms/organizations";

interface TaskListProps {
  orgId?: string; // Optional - if provided, only shows tasks for that organization
}

export default function TaskList({ orgId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [organizations] = useAtom<(Organization & { isOwner: boolean })[]>(organizationsAtom);
  
  // Filtering and sorting
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check if user is owner of the current organization
  const currentOrg = organizations.find(org => org.id === orgId);
  const isOwner = currentOrg?.isOwner ?? false;
  
  const fetchTasks = async () => {
    setLoading(true);
    try {
      if (orgId) {
        // If orgId is provided, get tasks for that organization
        const filters: { status?: string } = {};
        if (statusFilter !== "all") {
          filters.status = statusFilter;
        }
        
        const fetchedTasks = await getTasks(orgId, filters);
        setTasks(fetchedTasks);
      } else {
        // If no orgId, we need to get tasks from all user's organizations
        // First get all organizations the user is part of
        const orgs = await getUserOrganizations();
        
        // Then fetch tasks for each organization and combine them
        const allTasks: Task[] = [];
        for (const org of orgs) {
          const orgTasks = await getTasks(org.id);
          allTasks.push(...orgTasks);
        }
        
        setTasks(allTasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [orgId]);
  
  // When status filter changes, refetch tasks if viewing a specific organization
  useEffect(() => {
    if (orgId) {
      fetchTasks();
    }
  }, [statusFilter, orgId]);
  
  const handleCreateTask = () => {
    setEditTask(null);
    setShowTaskForm(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };
  
  const handleTaskFormSubmit = () => {
    setShowTaskForm(false);
    fetchTasks();
  };
  
  const handleTaskFormCancel = () => {
    setShowTaskForm(false);
    setEditTask(null);
  };
  
  const handleTaskUpdate = () => {
    fetchTasks();
  };
  
  const handleTaskDelete = () => {
    setSelectedTask(null);
    fetchTasks();
  };
  
  // Filter and sort tasks - only need to filter by status if viewing all orgs
  // (otherwise the API handles status filtering)
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Only apply status filter in memory if we're viewing all organizations
      // (for a specific org, we've already filtered via the API)
      if (!orgId && statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          task.title.toLowerCase().includes(term) ||
          (task.description && task.description.toLowerCase().includes(term))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Handle sorting by different fields
      let compareA: any = a[sortField as keyof Task];
      let compareB: any = b[sortField as keyof Task];
      
      // Handle nested fields
      if (sortField === "organization") compareA = a.organization?.name;
      if (sortField === "organization") compareB = b.organization?.name;
      if (sortField === "assignee") compareA = a.assignee?.fullName;
      if (sortField === "assignee") compareB = b.assignee?.fullName;
      
      // Handle null values
      if (compareA === null || compareA === undefined) return sortDirection === "asc" ? -1 : 1;
      if (compareB === null || compareB === undefined) return sortDirection === "asc" ? 1 : -1;
      
      // Sort strings or dates
      if (typeof compareA === "string") {
        const comparison = compareA.localeCompare(compareB);
        return sortDirection === "asc" ? comparison : -comparison;
      }
      
      // Sort numbers
      return sortDirection === "asc" ? compareA - compareB : compareB - compareA;
    });
  
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900 text-yellow-300";
      case "in-progress":
        return "bg-blue-900 text-blue-300";
      case "completed":
        return "bg-green-900 text-green-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          {orgId ? "Organization Tasks" : "My Tasks"}
        </h2>
        {isOwner && (
          <Button onClick={handleCreateTask}>Create Task</Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 bg-[#212121] border border-[#404040] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No tasks found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#171717]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Created By</th>
                {isOwner && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAndSortedTasks.map((task) => (
                <tr 
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className="hover:bg-[#303030] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-white">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-400">{task.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                    {new Date(task.dueAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-300">
                    {task.creator?.fullName}
                  </td>
                  {isOwner && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task);
                        }}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#333333] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <TaskDetails 
              taskId={selectedTask}
              onClose={() => setSelectedTask(null)}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
            />
          </div>
        </div>
      )}
      
      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#333333] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editTask ? "Edit Task" : "Create New Task"}
            </h2>
            <TaskForm
              onSubmit={handleTaskFormSubmit}
              onCancel={handleTaskFormCancel}
              initialData={editTask || (orgId ? { orgId } : undefined)}
              orgId={orgId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
