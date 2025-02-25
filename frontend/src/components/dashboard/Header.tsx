import { Button } from "../ui/button";
export default function Header({ onJoinClick, onCreateClick }: { onJoinClick: () => void; onCreateClick: () => void }) {
    return (
      <header className="w-full text-white shadow-md p-5 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <nav className="flex gap-4 text-black">
          <Button onClick={onJoinClick} variant="outline" className="cursor-pointer">Join Organization</Button>
          <Button onClick={onCreateClick} variant="outline" className="cursor-pointer">Create Organization</Button>
          <Button variant="destructive" className="cursor-pointer">Logout</Button>
        </nav>
      </header>
    );
  }