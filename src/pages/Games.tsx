import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MdDelete } from "react-icons/md";
import { toast } from "@/hooks/use-toast";

const Games = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('jeopardy_games')
        .select(`
          id,
          name,
          created_by,
          users (username),
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
        // Transform data to calculate total questions for each game
        const gamesWithQuestions = data.map(game => ({
          ...game,
          totalQuestions: game.categories.reduce((total, category) => total + (category.questions ? category.questions.length : 0), 0),
        }));
  
        setGames(gamesWithQuestions);
      }
    };
  
    fetchGames();
  }, []);
  

  const deleteGame = async (gameId: string) => {
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
        variant: "success",
      });
    }
  };

  const openModal = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="glass-card p-6 space-y-4 hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-semibold">{game.name}</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Created by {game.users.username}
                </p>
                <div className="flex justify-between text-sm">
                  <span>{game.categories.length} Categories</span>
                  <span>{game.totalQuestions} Questions</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => navigate(`/games/${game.id}`)}
                  className="glass-card hover:bg-primary/20 flex-1"
                >
                  Play
                </Button>
                <Button
                  onClick={() => navigate(`/games/${game.id}/edit`)}
                  className="glass-card hover:bg-primary/20 flex-1"
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-900 hover:bg-red-950 maw-w-2 flex-1"
                  onClick={() => openModal(game)}
                >
                  <MdDelete />
                </Button>
              </div>
            </div>
          ))}
        </div>
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
  );
};

export default Games;