import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { authenticateUser, isAdmin } from "@/lib/auth";

const ControlPanel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const authenticatedUser = authenticateUser(username, password);
    
    if (authenticatedUser) {
      setUser(authenticatedUser);
      toast({
        title: "Login successful",
        description: `Welcome, ${authenticatedUser.role}!`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-8">
        <div className="max-w-md mx-auto">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-6">Control Panel Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Control Panel</h1>
          <Button
            variant="outline"
            onClick={() => {
              setUser(null);
              setUsername("");
              setPassword("");
            }}
          >
            Logout
          </Button>
        </div>

        {isAdmin(user) ? (
          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Admin User</h3>
                    <p className="text-sm text-gray-500">Username: admin</p>
                    <p className="text-sm text-gray-500">Password: ******</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Cashier User</h3>
                    <p className="text-sm text-gray-500">Username: cajero</p>
                    <p className="text-sm text-gray-500">Password: ****</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Limited Access</h2>
            <p>You don't have permission to view user management settings.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;