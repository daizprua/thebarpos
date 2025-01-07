import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { authenticateUser } from "@/lib/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticateUser(username, password);
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      
      const activeShiftStr = localStorage.getItem('activeShift');
      const activeShift = activeShiftStr ? JSON.parse(activeShiftStr) : null;
      
      toast({
        title: "Success",
        description: `Welcome, ${user.username}!`,
      });

      // Force a re-render by setting state in localStorage first
      localStorage.setItem('lastLogin', new Date().toISOString());
      
      // Small timeout to ensure state is updated before navigation
      setTimeout(() => {
        if (activeShift) {
          navigate('/pos', { replace: true });
        } else {
          navigate(user.role === 'admin' ? '/inventory' : '/pos', { replace: true });
        }
        // Force a re-render after navigation
        window.dispatchEvent(new Event('storage'));
      }, 100);
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Enter your credentials to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}