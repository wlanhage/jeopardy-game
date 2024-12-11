import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

const Games = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [games, setGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAllGames, setShowAllGames] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, username, role')
          .eq('email', email)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
        } else {
          setUser(userData);
        }
      }
    };

    fetchUser();
  }, [setUser]);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('jeopardy_games')
        .select(`
          id,
          name,
          created_by,
          view,
          categories (
            id,
            questions!category_id (
              id
            )
          )
        `);

      if (error) {
        console.error("Error fetching games:", error);
      } else {
        const gamesWithUserDetails = await Promise.all(
          data.map(async (game) => {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, email, username, role')
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

    fetchGames();
  }, []);

  const deleteGame = async (gameId) => {
    const { error } = await supabase
      .from('jeopardy_games')
      .delete()
      .eq('id', gameId);

    if (error) {
      console.error("Error deleting game:", error);
    } else {
      setGames(games.filter(game => game.id !== gameId));
      setIsModalOpen(false);
      toast({
        title: "Game Deleted",
        description: "The game has been successfully deleted.",
        variant: "default",
      });
    }
  };

  const openModal = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const filteredGames = games.filter(game => {
    if (user.role === 'admin' && showAllGames) {
      return true;
    }
    if (game.view) {
      return true;
    }
    return game.created_by.id === user.id;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Games</h1>
          <Button
            onClick={() => navigate("/")}
            className="glass-card hover:bg-primary/20"
          >
            Home
          </Button>
          <Button
            onClick={() => navigate("/games/create")}
            className="glass-card hover:bg-primary/20"
          >
            Create New Game
          </Button>
          {user.role === 'admin' && (
            <Button
              onClick={() => setShowAllGames(!showAllGames)}
              className="glass-card hover:bg-primary/20"
            >
              {showAllGames ? "Show Normal View" : "Show All Games"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="glass-card p-4 space-y-4"
            >
              <h2 className="text-2xl font-bold">{game.name}</h2>
              <p>Created by: {game.created_by?.username || "Unknown"}</p>
              <div className="flex justify-between">
                <p>Questions: {game.totalQuestions}</p>
                <p>Categories: {game.categories.length}</p>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => navigate(`/games/${game.id}/edit`)}
                  className="glass-card hover:bg-primary/20"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => openModal(game)}
                  className="glass-card hover:bg-primary/20"
                >
                  <MdDelete />
                </Button>
                <Button
                  onClick={() => navigate(`/games/${game.id}`)}
                  className="glass-card hover:bg-primary/20"
                >
                  Play
                </Button>
              </div>
            </div>
          ))}
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
                    onClick={() => deleteGame(selectedGame.id)}
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
  );
};

export default Games;