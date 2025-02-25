 import { Button } from "@/components/ui/button";
 export default function Sidebar() {
    return (
      <aside className="w-64 shadow-md p-4 min-h-screen">
        <nav className="flex flex-col gap-4 text-white">
          <Button variant="secondary">My Organizations</Button>
          <Button variant="secondary">My Profile</Button>
          <Button variant="secondary">My Completed Tasks</Button>
        </nav>
      </aside>
    );
  }