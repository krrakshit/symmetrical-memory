import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Card, CardContent } from "../ui/card";

function MyTasks({ tasks }: { tasks: { org:string; name: string; description: string; assignedDate: string; dueDate: string }[] }) {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-semibold text-white">My Tasks</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Card
              key={index}
              className="min-w-[300px] bg-white/95 hover:bg-white transition-colors duration-200 rounded-xl shadow-lg border-0"
            >
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-tight">{task.name}</h3>
                  <h2 className="text-xl font-semibold tracking-tight">{task.org}</h2>
                  <p className="text-muted-foreground">{task.description}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <span>Assigned: </span>
                    <span className="ml-1 font-medium">{task.assignedDate}</span>
                  </div>
                  <div className="flex items-center text-red-500">
                    <span>Due: </span>
                    <span className="ml-1 font-medium">{task.dueDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-full text-center py-8">
            <p className="text-muted-foreground">No tasks assigned.</p>
          </div>
        )}
      </div>
    </div>
  )
}


export default function Dashboard() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgCode, setOrgCode] = useState("");

  const tasks = [
    { org:"org1", name: "Task 1", description: "Complete the project documentation.", assignedDate: "2025-02-20", dueDate: "2025-02-28" },
    { org:"org2", name: "Task 2", description: "Fix bugs in the authentication module.", assignedDate: "2025-02-22", dueDate: "2025-03-01" },
    { org:"org3", name: "Task 3", description: "Fix bugs in the signup", assignedDate: "2025-02-22", dueDate: "2025-03-01" }
  ];

  function generateOrgCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function handleCreateOrg() {
    const newOrgCode = generateOrgCode();
    setOrgCode(newOrgCode);
  }

  return (
    <div>
      <Header onJoinClick={() => setJoinOpen(true)} onCreateClick={() => { setCreateOpen(true); handleCreateOrg(); }} />
        <div className="flex">
      <Sidebar/>
      <MyTasks tasks={tasks} />
        </div>
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>Join Organization</DialogTitle>
          </DialogHeader>
          <Input 
            type="text" 
            placeholder="Enter 6-digit code" 
            value={joinCode} 
            onChange={(e) => setJoinCode(e.target.value)} 
            className="mb-4" 
            maxLength={6}
          />
          <Button onClick={() => alert(`Joining org with code: ${joinCode}`)}>Join</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <Input 
            type="text" 
            placeholder="Enter organization name" 
            value={orgName} 
            onChange={(e) => setOrgName(e.target.value)} 
            className="mb-4"
          />
          <Input 
            type="text" 
            placeholder="Enter organization description" 
            value={orgDescription} 
            onChange={(e) => setOrgDescription(e.target.value)} 
            className="mb-4"
          />
          <Input 
            type="text" 
            value={orgCode} 
            readOnly 
            className="mb-4 bg-gray-200 cursor-not-allowed"
          />
          <Button onClick={() => alert(`Creating org: ${orgName}, Code: ${orgCode}`)}>Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
