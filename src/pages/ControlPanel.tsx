import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { authenticateUser, isAdmin, getAllUsers, createUser, updateUser, deleteUser } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ControlPanel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // User management state
  const [users, setUsers] = useState(getAllUsers());
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "cajero">("cajero");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const authenticatedUser = authenticateUser(username, password);
    
    if (authenticatedUser) {
      setUser(authenticatedUser);
      toast({
        title: "Login successful",
        description: `Welcome, ${authenticatedUser.role}!`,
      });
      // Refresh users list after login
      setUsers(getAllUsers());
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = () => {
    try {
      createUser({
        username: newUsername,
        password: newPassword,
        role: newRole,
      });
      setUsers(getAllUsers());
      setNewUsername("");
      setNewPassword("");
      setNewRole("cajero");
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    try {
      updateUser(editingUser.username, {
        password: newPassword || undefined,
        role: newRole,
      });
      setUsers(getAllUsers());
      setIsEditing(false);
      setEditingUser(null);
      setNewPassword("");
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = (username: string) => {
    try {
      deleteUser(username);
      setUsers(getAllUsers());
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add New User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-username">Username</Label>
                        <Input
                          id="new-username"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-role">Role</Label>
                        <Select value={newRole} onValueChange={(value: "admin" | "cajero") => setNewRole(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="cajero">Cashier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateUser}>Create User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((u) => (
                    <div key={u.username} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{u.username}</h3>
                          <p className="text-sm text-gray-500">Role: {u.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog open={isEditing && editingUser?.username === u.username} onOpenChange={(open) => {
                            if (!open) {
                              setIsEditing(false);
                              setEditingUser(null);
                              setNewPassword("");
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsEditing(true);
                                  setEditingUser(u);
                                  setNewRole(u.role);
                                }}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User: {u.username}</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-password">New Password (optional)</Label>
                                  <Input
                                    id="edit-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Leave blank to keep current password"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-role">Role</Label>
                                  <Select value={newRole} onValueChange={(value: "admin" | "cajero") => setNewRole(value)}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="cajero">Cashier</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button onClick={handleUpdateUser}>Update User</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(u.username)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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