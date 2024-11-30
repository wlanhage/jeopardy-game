import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateGame = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<string[]>([""]);

  const addCategory = () => {
    setCategories([...categories, ""]);
  };

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement game creation with Firebase
    navigate("/games");
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
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Categories</label>
              {categories.map((category, index) => (
                <Input
                  key={index}
                  value={category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  className="glass-card"
                  placeholder={`Category ${index + 1}`}
                  required
                />
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