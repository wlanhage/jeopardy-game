import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Admin = () => {
  // Mock data - replace with actual data fetching
  const [users] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "user" },
  ]);

  const [games] = useState([
    { id: 1, title: "Science Quiz", status: "active" },
    { id: 2, title: "History Masters", status: "inactive" },
    { id: 3, title: "Pop Culture", status: "active" },
  ]);

  const handleRoleChange = (userId: number, newRole: string) => {
    // TODO: Implement role change
    toast.success(`Updated role for user ${userId} to ${newRole}`);
  };

  const handleGameStatusChange = (gameId: number, newStatus: string) => {
    // TODO: Implement status change
    toast.success(`Updated status for game ${gameId} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold mb-6">User Management</h2>
          <div className="glass-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-6">Game Management</h2>
          <div className="glass-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.title}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={game.status}
                        onValueChange={(value) => handleGameStatusChange(game.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;