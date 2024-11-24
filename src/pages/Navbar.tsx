import { Button } from "@/components/ui/button";
import { LogIn, LogsIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
            SafeSoc
        </Link>
        <div className="space-x-4 flex">
            <Button>
            <Link to="/login" className="text-white">
            <div className="flex justify-center gap-2">
                <LogIn/>
                <span>Login</span>
            </div>
          </Link>
            </Button>
            <Button variant='outline' size='lg'>
          <Link to="/signup" className="text-white">
          <div className="flex justify-center gap-2">
            <LogsIcon/>
            <span>Sign Up</span>
          </div>
          </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
