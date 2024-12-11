import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { MdDelete } from "react-icons/md";

const CreateGame = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        setError("Error fetching user.");
      } else {
        setUser(userData);
      }
    }
  };

  useState(() => {
    fetchUser();
  });

  const addCategory = () => {
    setCategories([...categories, ""]);
  };

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const deleteCategory = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("User is not authenticated.");
      return;
    }

    const { data: game, error: gameError } = await supabase
      .from('jeopardy_games')
      .insert([{ name: title, created_by: user.id }])
      .select()
      .single();

    if (gameError) {
      console.error("Error creating game:", gameError);
      setError("Error creating game.");
      return;
    }

    if (!game) {
      console.error("Failed to create game");
      setError("Failed to create game.");
      return;
    }

    for (const category of categories) {
      const { error: catError } = await supabase
        .from('categories')
        .insert([{ name: category, game_id: game.id }]);

      if (catError) {
        console.error("Error creating category:", catError);
        setError("Error creating category.");
        return;
      }
    }

    navigate(`/games/${game.id}/edit`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Create New Game</h1>
          <p className="text-muted-foreground mt-2">
            Set up your custom Jeopardy game
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Game Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-card"
                placeholder="Enter game title"
                required
              />
              
              <select name="view" id="view" className="text-gray bg-black">
                <option value="true">Public</option>
                <option value="false">Private</option>
                
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Categories</label>
              {categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={category}
                    onChange={(e) => updateCategory(index, e.target.value)}
                    className="glass-card flex-1"
                    placeholder={`Category ${index + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => deleteCategory(index)}
                    className="glass-card hover:bg-primary/20"
                  >
                    <MdDelete />
                  </Button>
                </div>
              ))}
              {categories.length < 6 && (
                <Button
                  type="button"
                  onClick={addCategory}
                  className="w-full glass-card hover:bg-primary/20"
                >
                  Add Category
                </Button>
              )}
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate("/games")}
              className="glass-card hover:bg-primary/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="glass-card hover:bg-primary/20"
              disabled={categories.length === 0 || !title}
            >
              Create Game
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGame;