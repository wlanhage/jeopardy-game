import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold tracking-tight">
          React Jeopardy
        </h1>
        <p className="text-xl text-muted-foreground">
          Create and play custom Jeopardy games
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/login")}
          className="glass-card hover:bg-primary/20"
        >
          Login
        </Button>
        <Button
          onClick={() => navigate("/register")}
          className="glass-card hover:bg-primary/20"
        >
          Register
        </Button>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Create Games</h3>
          <p className="text-muted-foreground">
            Design your own Jeopardy games with custom categories and questions
          </p>
        </div>
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Play Online</h3>
          <p className="text-muted-foreground">
            Challenge friends or play solo in real-time
          </p>
        </div>
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xl font-semibold">Track Scores</h3>
          <p className="text-muted-foreground">
            Keep track of points and compete for high scores
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;