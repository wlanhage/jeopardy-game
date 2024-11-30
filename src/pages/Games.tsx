import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Games = () => {
  const navigate = useNavigate();

  const mockGames = [
    { id: 1, title: "Science Quiz", categories: 6, questions: 30, creator: "John" },
    { id: 2, title: "History Masters", categories: 6, questions: 30, creator: "Sarah" },
    { id: 3, title: "Pop Culture", categories: 6, questions: 30, creator: "Mike" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Games</h1>
          <Button
            onClick={() => navigate("/games/create")}
            className="glass-card hover:bg-primary/20"
          >
            Create New Game
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockGames.map((game) => (
            <div
              key={game.id}
              className="glass-card p-6 space-y-4 hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-semibold">{game.title}</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Created by {game.creator}
                </p>
                <div className="flex justify-between text-sm">
                  <span>{game.categories} Categories</span>
                  <span>{game.questions} Questions</span>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;