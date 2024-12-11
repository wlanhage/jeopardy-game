import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { MdDelete } from "react-icons/md";


const Admin = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, role');

      if (error) {
        console.error(error);
      } else {
        setUsers(data);
      }
    };

    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('jeopardy_games')
        .select(`
          id,
          name,
          created_by,
          categories (
            id,
            questions!category_id (
              id
            )
          )
        `);

      if (error) {
        console.error(error);
      } else {
        const gamesWithUserDetails = await Promise.all(
          data.map(async (game) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, email, username')
              .eq('id', game.created_by)
              .single();

            if (userError) {
              console.error(userError);
              return { ...game, created_by: null };
            }

            return {
              ...game,
              created_by: userData,
              totalQuestions: game.categories.reduce((total, category) => total + (category.questions ? category.questions.length : 0), 0),
            };
          })
        );

        setGames(gamesWithUserDetails);
      }
    };

    fetchUsers();
    fetchGames();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error(error);
      toast.error(`Failed to update role for user ${userId}`);
    } else {
      const updatedUser = users.find(user => user.id === userId);
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      toast.success(`Updated role for user ${updatedUser?.username} to ${newRole}`);
    }
  };

  const handleGameStatusChange = async (gameId: string, newStatus: string) => {
    const { error } = await supabase
      .from('jeopardy_games')
      .update({ status: newStatus })
      .eq('id', gameId);

    if (error) {
      console.error(error);
      toast.error(`Failed to update status for game ${gameId}`);
    } else {
      setGames(games.map(game => game.id === gameId ? { ...game, status: newStatus } : game));
      toast.success(`Updated status for game ${gameId} to ${newStatus}`);
    }
  };

  const handleGameViewChange = async (gameId: string, newView: boolean) => {
    const { error } = await supabase
      .from('jeopardy_games')
      .update({ view: newView })
      .eq('id', gameId);

    if (error) {
      console.error(error);
      toast.error(`Failed to update role for user ${gameId}`);
    } else {
      const updatedGameView = users.find(user => user.id === userId);
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      toast.success(`Updated role for user ${updatedUser?.username} to ${newRole}`);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 space-y-6 text-center">
          <h2 className="text-2xl font-bold">Authorization Error</h2>
          <p>Your role does not have authorization for this page. Contact the product owner and return.</p>
          <Button onClick={() => navigate("/")} className="glass-card hover:bg-primary/20">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const openModal = (game) => {
    setSelectedGameId(selectedGameId);
    setIsModalOpen(true);
  };

  const deleteGame = async (selectedGameId) => {
    if (!selectedGameId) {
      toast.error('couldnt find selected game');
      return;
    }

    const { error } = await supabase
      .from('jeopardy_games')
      .delete()
      .eq('id', selectedGameId);

    if (error) {
      console.error("Error deleting game:", error);
      toast.error('Failed to delete game')
    } else {
      setGames(games.filter(game => game.id !== selectedGameId));
      setIsModalOpen(false);
      toast.success('Successfully deleted game')
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        <div>
        <div className="flex">
          <h2 className="text-3xl font-bold mb-6">User Management</h2>
          <Button className="glass-card hover:bg-primary/20 flex-1" 
          onClick={() => navigate("/")}>Home</Button>
          </div>
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
                    <TableCell>{user.username}</TableCell>
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
                          <SelectItem value="player">Player</SelectItem>
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
                  <TableHead>Created by</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Questions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.name}</TableCell>
                    <TableCell>{game.created_by?.username || "Unkno"}</TableCell>
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
                    <TableCell>{game.totalQuestions}</TableCell>
                    <TableCell>{game.categories.length}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => openModal(game.id)}
                        className="glass-card hover:bg-primary/20"
                      >
                  <MdDelete />
                </Button>
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this game?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="glass-card hover:bg-primary/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={deleteGame}
                    className="glass-card hover:bg-primary/20"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        </div>
      </div>
    </div>
    
  );
};

export default Admin;